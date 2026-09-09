import { afterEach, describe, expect, it, vi } from "vitest";
import { createChatSdkEndpointRuntime } from "./chat-sdk-runtime.js";
import { streamSafePublicationText } from "./chat-publication-stream.js";

const persistence = {
  async compareAndSet() {
    return true;
  },
  async deleteIfVersion() {
    return true;
  },
  async read() {
    return null;
  },
};
const source = "A complete, approved answer with useful details. ".repeat(60);

afterEach(() => vi.unstubAllGlobals());

describe("already-approved publication streaming", () => {
  it.each([
    { label: "ordinary text", text: source, expected: source },
    {
      label: "many paragraphs",
      text: "Result here.\n\n".repeat(350) + "TAIL",
      expected: "Result here.\n\n".repeat(350) + "TAIL",
    },
    {
      label: "cached mentions",
      text: "@x result. ".repeat(250) + "TAIL",
      expected: "<@U0123456789> result. ".repeat(250) + "TAIL",
    },
    {
      label: "expanding cached mentions",
      text: "@x\n\n".repeat(499),
      expected: `<@U${"A".repeat(20)}>\n\n`.repeat(499),
      cachedUserId: `U${"A".repeat(20)}`,
    },
    {
      label: "astral and fenced text",
      text: "😀".repeat(1_100) + "\n\n```text\n@x stays literal\n```\n\nTAIL",
      expected:
        "😀".repeat(1_100) + "\n\n```text\n@x stays literal\n```\n\nTAIL",
    },
  ])(
    "finishes native Slack $label without artificial producer delays",
    async ({ text, expected, cachedUserId }) => {
      const runtime = createChatSdkEndpointRuntime({
        callbacks: { onMessage() {} },
        companyId: "ready-slack-company",
        endpointId: "ready-slack-endpoint",
        logger: "silent",
        persistence,
        providerConfig: {
          provider: "slack",
          userName: "paperclip-agent",
          credentials: {
            botToken: "xoxb-test",
            botUserId: "U-BOT",
            signingSecret: "test",
          },
        },
      });
      try {
        await runtime.initialize();
        type StreamCall = { chunks: Array<{ type: string; text: string }> };
        const calls: StreamCall[] = [];
        const accept = async (input: StreamCall) => {
          calls.push(input);
          return { ok: true, ts: "1788.901" };
        };
        const start = vi.fn(accept);
        const append = vi.fn(accept);
        const stop = vi.fn(accept);
        const adapter = runtime.getProviderAdapter() as unknown as {
          _client: {
            chat: {
              startStream: unknown;
              appendStream: unknown;
              stopStream: unknown;
            };
          };
          chat: { getState(): { getList(key: string): Promise<string[]> } };
          stream(
            threadId: string,
            chunks: AsyncIterable<string>,
          ): Promise<{ id: string }>;
        };
        // Keep the real pinned Web API ChatStreamer buffer/serialization path.
        adapter._client.chat.startStream = start;
        adapter._client.chat.appendStream = append;
        adapter._client.chat.stopStream = stop;
        vi.spyOn(adapter.chat.getState(), "getList").mockImplementation(
          async (key) =>
            key === "slack:user-by-name:x"
              ? [cachedUserId ?? "U0123456789"]
              : [],
        );
        const wait = vi.fn(async (_delayMs: number) => undefined);
        const result = await adapter.stream(
          "slack:D-PAPERCLIP:1788.400",
          streamSafePublicationText(text, { wait }),
        );
        expect(result.id).toBe("1788.901");
        expect(start).toHaveBeenCalledOnce();
        expect(stop).toHaveBeenCalledOnce();
        expect(calls.length).toBeLessThanOrEqual(
          Math.ceil(
            Array.from(text).length / (/[@&]/.test(text) ? 280 : 2_000),
          ) + 1,
        );
        expect(
          calls
            .flatMap((input) => input.chunks)
            .map((chunk) => chunk.text)
            .join(""),
        ).toBe(expected);
        expect(
          calls.every((input) =>
            input.chunks.every(
              (chunk) =>
                chunk.type === "markdown_text" && chunk.text.length <= 12_000,
            ),
          ),
        ).toBe(true);
        expect(wait).not.toHaveBeenCalled();
      } finally {
        await runtime.shutdown();
      }
    },
  );

  it.each(["private", "supergroup"] as const)(
    "preserves Telegram %s delivery and provider pacing without artificial producer delays",
    async (chatType) => {
      const chatId = chatType === "private" ? 123 : -100123;
      const requests: Array<{ method: string; body: Record<string, unknown> }> =
        [];
      vi.stubGlobal(
        "fetch",
        vi.fn(async (url: string, init: RequestInit) => {
          const method = String(url).split("/").at(-1)!;
          const body = JSON.parse(String(init.body)) as Record<string, unknown>;
          requests.push({ method, body });
          return Response.json({
            ok: true,
            result: method.endsWith("Draft")
              ? true
              : {
                  message_id: 901,
                  date: 1788910000,
                  chat: { id: chatId, type: chatType },
                  from: { id: 123, is_bot: true, first_name: "Paperclip" },
                  text: source,
                },
          });
        }),
      );
      const runtime = createChatSdkEndpointRuntime({
        callbacks: { onMessage() {} },
        companyId: "ready-telegram-company",
        endpointId: "ready-telegram-endpoint",
        logger: "silent",
        persistence,
        providerConfig: {
          provider: "telegram",
          userName: "paperclip_agent_bot",
          credentials: { botToken: "123:test", secretToken: "test" },
        },
      });
      try {
        const adapter = runtime.getProviderAdapter() as unknown as {
          sleep(ms: number): Promise<void>;
          stream(
            threadId: string,
            chunks: AsyncIterable<string>,
          ): Promise<{ id: string }>;
        };
        const providerPacing = vi.fn(async (_delayMs: number) => undefined);
        adapter.sleep = providerPacing;
        const wait = vi.fn(async (_delayMs: number) => undefined);
        const result = await adapter.stream(
          `telegram:${chatId}`,
          streamSafePublicationText(source, { wait }),
        );
        expect(result.id).toBe(`${chatId}:901`);
        const drafts = requests.filter(
          ({ method }) => method === "sendRichMessageDraft",
        );
        if (chatType === "private") {
          expect(drafts.length).toBeGreaterThan(0);
          expect(drafts.length).toBeLessThanOrEqual(2);
          const final = requests.filter(
            ({ method }) => method === "sendRichMessage",
          );
          expect(final).toHaveLength(1);
          expect(final[0].body.rich_message).toEqual({
            markdown: source.trimEnd(),
          });
          expect(providerPacing).not.toHaveBeenCalled();
        } else {
          expect(drafts).toHaveLength(0);
          // The SDK's own final-edit rate-limit pacing must not be removed.
          expect(providerPacing).toHaveBeenCalledOnce();
          expect(providerPacing.mock.calls[0][0]).toBeGreaterThan(0);
          expect(requests.at(-1)?.method).toBe("editMessageText");
          expect(requests.at(-1)?.body.rich_message).toEqual({
            markdown: source.trimEnd(),
          });
        }
        expect(wait).not.toHaveBeenCalled();
      } finally {
        await runtime.shutdown();
      }
    },
  );
});
