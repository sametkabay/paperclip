# Temporary chat qualification handoff

Delete this note when the remaining items are fixed or moved into permanent
verification documentation. It is not a release-completion claim.

Updated September 9, 2026. Older scratch checkpoints are preserved in Git at
`f66bedd63`; they are intentionally not repeated as current work here.
The [permanent qualification log](2026-09-08-chat-queue-and-webhook-repair.md)
contains the chronological evidence and failed attempts. The
[browser runbook](2026-09-04-chat-adapters-browser-e2e-runbook.md) remains the
provider acceptance checklist.

## Goal and working boundaries

Finish production-quality Slack, GitHub, Microsoft Teams and Telegram chat,
plus the user's explicitly added Discord connector. Test real conversations,
files/images, interactions, races, queues, reactions, retries and the quality
of the experience. External chat is transport; Paperclip owns tasks, runs,
permissions and audit. Do not narrow completion to whichever tests pass.

- Work only in `/Users/dotta/paperclipai/branches/chat-adapters`, branch
  `codex/chat-adapters`. No additional worktree. Preserve user changes.
- Commit and push coherent verified fixes; do not tend PRs until the features
  work. The wireframe images have already been removed; do not recreate them.
- Root owns Git, live server, ordinary runner staging and signed-in browser.
  Use parallel agents for disjoint implementation or bounded review.
- No filesystem/command approval requests. Only real login, MFA, CAPTCHA,
  tenant/admin or unavailable-secret gates need the user.
- Use the signed-in in-app browser for live provider accounts. A mocked browser
  or successful API response does not establish a good live experience.
- Never export raw reasoning, tool arguments, private logs, credentials or
  private source-file URLs. Never replay `delivery_unknown` without its
  explicit audited resolution.
- One endpoint is one provider bot identity bound to one immutable agent;
  one external thread maps to one task. Recheck current source, reach,
  generation, identity and permissions at every consequential boundary.
- Use a fresh PostgreSQL fixture database for each full integration rerun.
  Never use a test to repair live records or manufacture recovery authority.

## Current deployment

Implementation `52a46cbf6` is pushed and deployed, adding Telegram retained-zero
recovery fencing, bounded rich input and private callback notices, and removing
artificial completed-response pacing. It includes the earlier Slack receipt,
source-bound media, Teams-picture, Discord-command and native recovery repairs.
Server **76** is running:

| Field                    | Verified value                                                          |
| ------------------------ | ----------------------------------------------------------------------- |
| PID / tool handle        | `45500` / `38031`                                                       |
| Listener                 | `127.0.0.1:3137`                                                        |
| Loaded server version    | `2026.831.0+616.git.52a46cbf6.dirty`                                    |
| Started / recovery ready | `08:15:25.777` / `08:15:29.173 UTC`, September 9                        |
| Native runner SHA256     | `6279d39ac731e4565a638b64c93673b8ca23e6dfbc0870e24d48422497f1826d`      |
| Live DB                  | `chat_adapters_live_3103` on local PostgreSQL `55439`, role `paperclip` |
| Last checked runs        | 290 terminal: 262 succeeded, 26 failed, 2 cancelled; zero active        |
| Last new run             | September 9, `02:15:47.812 UTC`                                         |

Both loopback and private Tailscale health returned 200/ready. Public Funnel's
Board-health GET remains 404. Discord Gateway reconnected bot
`1546330979860221952`. Automatic registration committed a processed/registered
receipt for command `1547131713472430131` at `06:29:05.036 UTC`; the active
endpoint now has both slash-command and ephemeral-message capability. This
proves live provider registration, not invocation or private-response UX.
The health response's Git commit is dynamic; use loaded version and process
start to identify deployed code. The loaded `.dirty` suffix reflects only
three documentation files being updated during startup; runtime source was
committed and its reviewed hashes matched.

Server 75 exited cleanly after a fresh zero-active-run check at
`08:14:57.129 UTC`; the graceful drain interrupted zero runs. Its stopped
database was backed up to private
`pre-76-backup.gKWl0c/pre-server-76-20260909-031506.sql.gz`
(8,498,228 bytes; directory 0700/file 0600; gzip integrity passed; restore not
tested; no backup pruned). No migration was needed: journal count 257, up to
date. No credentials or historical recovery records were rewritten.
At `08:15:48.704 UTC`, the run inventory remained 290 terminal, zero active,
and the original Discord/GitHub/Slack/Telegram endpoints remained active.
The qualified runner and lockfile SHA256 values are unchanged.

Private Board: `https://dottas-macbook-pro.tail29c1aa.ts.net`.
Public webhook-only proxy: port `3104` → `3137`; Funnel uses stable port
`8443` (also existing `10000`). Do not expose the Board or files publicly.
Port **3103 belongs to another checkout** and must not be touched.

Passive rejection diagnostics are committed/pushed as `6c5e9c215`. After
verifying zero active proxy connections, root replaced proxy PID 48112 with
PID **27961**, handle **3313**. Log: `webhook-proxy-rejections-0909.log`.
A non-mutating GET through public Funnel at 03:51:14 UTC returned the expected
404 and exactly one closed-label method-rejection record. This proves proxy
deployment/rejection visibility, not provider message delivery. Server 69 was
not restarted during this proxy-only change.

All local runtime material is under ignored
`.paperclip-runtime/chat-adapters-live/`, including:

- `start-server.sh`: configured isolated startup, no embedded credentials.
- `server-experimental-landing-76.log`: current server log.
- `pre-server-76-backup-0909.log`: private backup/schema metadata.
- `qualified-runnerd-2400740c`: preserved old qualified runner backup.
- `home/instances/chat-adapters-live/runtime/paperclip-runner/durable-sessions`:
  live native roots; do not manipulate historical evidence.

**Build caution:** server `pnpm typecheck` invokes a full runner build and
stages the binary. For source checks use an explicit package TS-only build,
then `pnpm exec tsc --noEmit` from `server/`. Root briefly triggered that
side effect, restored exact signed `2400740c…`, and audited no new live runs;
the later `6279d39a…` cutover was deliberate after qualification. Do not
describe the normal binary as continuously unchanged across that earlier check.

## Immediate next actions

1. **Resume real browser qualification on server 76.** Latest actual browser
   inventory reports **Mac locked**; the user has been asked to unlock it.
   Discord login was restored before the lock. Do not request Discord login
   again unless the actual provider page requires it.
2. Run Discord native-command checklist DC4a, including private status, DM new,
   guild new guidance and bound-thread close. Then repeat same-thread
   Discord/Slack conversations, queueing and two-file output
   on this deployment. Check transitions, failure copy, final placement,
   reaction cleanup, duplicates and usable returned files, not just final text.
3. On GitHub, exercise the deployed unavailable-file fallback, click its task
   link, and upload the file on that task. Check the correct company, immediate
   chooser readiness and actual usable upload. This complete live journey is
   still unverified; deterministic cases already pass.
4. Continue the remaining browser-runbook permutations. Do not merge or edit
   the disposable GitHub repository while using its PR comments for chat QA.
5. Teams requires an eligible Microsoft 365 work/school tenant and authorized
   Entra/Azure Bot/custom-app setup. Personal Teams login is insufficient.
   Its deterministic tests are not tenant-qualified live proof.
6. Preserve the historical recovery boundaries below. A new conversation can
   qualify new work, but cannot be presented as successful recovery of the
   original failed request.
7. Live-retest the deployed Telegram photo/document boundary and Discord
   normalized interaction denial. Code and deterministic regressions are
   complete; they are not newly qualified live provider journeys.

## Current parallel work and audit conclusions

**Current additional work:** James's Slack rendered-paragraph repair is frozen
and independently reviewed. Root staged the exact candidate in this checkout's
installed adapter; default-import regression passes 192/192. Server 76 has not
been restarted, so this is not deployed or live-provider proof. The repair
bounds post-mention-resolution payloads including the SDK's pending buffer,
validates coherent native receipts and prevents fallback after ambiguous or
partial delivery. Boole's Telegram Stop implementation is also frozen and
independently reviewed: it stops the exact private draft presentation, never
the current task/run. Durable ownership, final-send arbitration and a
non-reusing instance sequence are covered by the new tests. Root's fresh
combined repeat passes **825/825** integration, **31/31** deterministic browser
and **348/348** helper/runtime tests. DB/shared/server/UI plain types pass.
Migration 0259 is generated and verified but not live yet; neither fix is
deployed at this checkpoint. Root repaired the server's release bundle
manifest so all five adapter patches and the Discord transport patch ship to
npm consumers. Packaging contracts pass 22/22; an isolated production-helper
stage at patch snapshot `1a0a77025` applied every patch and confirmed Discord
uses the patched transport. This is not a full server install or proof of the
new candidates; clean-install/lockfile reconciliation remains open.

**Current follow-up:** the restored Discord login is not the current gate:
the in-app browser tool still reports that the Mac is locked. Read-only health
confirms server 76 is ready and the original four configured endpoints remain
active; that is not a new live conversation. Slack receipt contention/cleanup
and Telegram optional-MIME/Live Photo repairs are now frozen and independently
reviewed. Slack's final joined repeat passes 10/10, and Telegram's repaired
configured-2-MiB cohort passes 22/22. After diagnosing three test-only failures,
root's fresh combined regression passes **770/770** integration tests in
149.26 seconds, **31/31** deterministic browser tests and **127/127** final
helper/runtime checks. Shared/server/UI plain types and targeted formatting
pass. These repairs are deployed on server 75 but are not live-provider proof.

Root corrected stale Teams file guidance: personal chats ask for file consent,
while channels/groups can receive supported images directly. The old universal
consent wording failed the updated regression before the fix. The full composer
component suite passes 27/27; two deterministic file-consent browser cases pass
on fresh `chat_teams_guidance_browser_20260909_root01` in 14.1 seconds. Root
inspected the rendered guidance screenshot; it fits without clipping. Provider
publication is simulated in those tests. Token gates and targeted formatting
pass. This does not qualify live Teams or the deployed Slack/Telegram repairs.

**In-progress provider-version work:** the [current Telegram Bot API contract](https://core.telegram.org/bots/api#recent-changes)
includes changes absent from the pinned adapter. A bounded read-only audit
confirmed rich Markdown output and private drafts already work; do not list
those as missing. Actual pinned-parser probes found three separate gaps:

- API 10.3 `expandable_blockquote` and rich `document` input disappeared,
  including a quotation beside a supported paragraph. Boole's inbound-only
  normalizer now passes the three original parser/service failures plus seven
  mixed-file/restart/topic/edit/revocation/dedup cases. It is independently
  reviewed; the fresh broader compatibility repeat passes 32/32. Unsupported or
  malformed content receives an explicit omission. Draft-only thinking and
  private button capabilities are never projected.
- James completed callback-only native ephemeral denial notices. The
  actual pinned runtime now rejects ephemeral messages/commands from ordinary
  `chat:0` admission and captures authenticated, recipient-bound callback
  provenance. Service-entry deadline, deduplication, current-authority and
  no-public-fallback regressions pass, including preserved exact-actor DM
  notices. The final Telegram cohort passes 154/154, helper/runtime 51/51 and
  plain server types. Private commands remain off.
- On server 76, native generation-stop updates are neither subscribed nor
  dispatched and draft IDs are process-local. The frozen successor now binds
  exact presentation authority durably and uses a noncycling sequence that
  survives rollback and endpoint/company deletion. The new TG4a runbook still
  requires live native-button qualification; deterministic Stop races pass.

Rich input and private callback fixes are committed/pushed as `b9802d9e4` and
deployed on server 76. Final recovery review found that **old queued Telegram
`chat:0` input** could bypass the new ingress guard when rehydrated with `raw: {}`;
an already-processed delivery with a pending wake also bypassed hydration.
Boole completed fixed-reason retained-source filtering and an independent
wakeup-authority guard, with positive-ID/legacy controls and no history
rewrites. Root reproduced a PostgreSQL microsecond timestamp CAS failure in
the initial filter. The repaired path locks and revalidates the current row,
and settles work only after a confirmed filter commit. Held claims and a
concurrently replaced positive source remain protected. The fresh final
cohort passes 47/47, including 15 recovery cases and 32 adjacent rich/media
cases; plain server types and independent review pass. Root's combined
helper/runtime suite passes 298/298. Full integration passes **812/812** on
fresh `chat_private_rich_full_20260909_root01` in 185.47 seconds; deterministic
browser checks pass **31/31** on separate fresh
`chat_private_rich_browser_20260909_root01` in 2.8 minutes. Shared/server/UI
plain types pass. Recovery fencing is committed/pushed as `52a46cbf6` and
deployed on server 76. These are not new live-provider conversations.
Native generation-stop remains undeployed at this checkpoint. Preserve recipient/source
authority and never expose raw model thinking merely because a provider
offers a thinking block.

**Ready-output latency repair (`a5ac8c7cc`, pushed, deployed on server 76):** completed, approved
publication text no longer needs simulated 75-ms generation pauses. Ordinary
text uses bounded 2,000-code-point batches; `@`/`&` content retains the prior
280-code-point batch because Slack resolves cached mentions after rendering.
Review reproduced a 12,974-character native chunk with a larger mention batch;
the conservative guard keeps that case within the provider limit. The separate
preexisting case of one unbroken paragraph expanding past the native limit
still needs a provider-rendered boundary fix. Do not mistake this small output
latency improvement for explaining the historical pre-ingress minute delays.
The six-file focused repeat passes 161/161 and the real-service safe-projection
case passes; provider pacing/final-receipt paths remain intact. No live UX claim.
James independently reproduced the remaining defect with the real pinned
adapter and a normal cached Slack user ID: a 2,704-character unbroken paragraph
became one 13,504-character native chunk. A strict local transport accepted a
prefix, then rejected the oversized chunk without a final receipt. The next
fix belongs after mention resolution in the adapter flush, including the
Web API's pending buffer; reducing source chunks cannot fix paragraph buffering.
Do not claim this case repaired or live-qualified.

**Local database interruption:** PostgreSQL logged backend PID 23977 killed by
SIGKILL at `07:49:34.230 UTC`, then recovered automatically and accepted
connections at `07:50:13.305`. The source of that signal is unproved. The rich
final-01 run failed during fixture seeding (32/32), not behavior assertions;
retain its log and use a new fixture database. At `07:51:06.576`, root verified
`pg_is_in_recovery = false`, server 75 healthy and the same 290 terminal runs,
zero active. No database reset, server restart or historical replay was used.

**Deployed in `cfbda24be` on server 74:** a bounded parallel acceptance
audit found two gaps beyond the browser lock. Explicit Board publication accepted
100,000 characters but the shared projector silently kept only 40,000. Four
real-service Slack/GitHub new/existing-comment cases reproduced the missing
tail; the frozen lossless transport now passes 19 joined cases and 47 helper
tests, including native-result, Unicode/rich-text, unknown-part and restart
coverage. Its first follow-up also exposed children sorting before a
database-timestamped root because JavaScript loses PostgreSQL microseconds;
children now preserve the root's exact database timestamp. A tiny-paragraph
CPU adversary improved from 6.1 seconds to under one second locally. Independent
boundary review found no remaining blocker; live rendering remains unqualified.

Teams channel/group pictures were incorrectly treated like arbitrary files,
both outbound and on intake. Root's two outbound cases reproduced zero native
images; the current thirteen-case service cohort passes, including actual
pinned SDK HTTP serialization, 100k text plus PNG ordering, malformed/large
fallback, source/reach withdrawal and unknown/missing receipts with no resend.
The bounded PNG/JPEG/static-GIF helper and pinned App HTTP tests pass in a
195-case adjacent cohort. The two pinned-parser-to-service intake RED cases
now pass in a 21-case intake/reference cohort, including deferred restart,
revocation, and pending source edits/deletes during download. Its 84-case
helper/runtime cohort also proves a deadline around the actual SDK's token
acquisition; late token release issues no HTTP. The new image lane shares one
10-second token/download budget, with no later request after expiry. This is
not a deadline or cancellation claim for DB/storage commits. Final root checks
pass 749/749 full integration tests (177.75 seconds), 31/31 deterministic
browser tests (2.9 minutes) on separate fresh databases, 163/163 helper/runtime
tests, shared/server/UI types, 85 UI tests and eight OpenAPI checks. No
eligible Teams tenant or live picture journey is claimed. Personal-file consent
and historical recovery evidence stay unchanged. The runbook now explicitly
requires experimental visibility checks and actual native Runner/Luna evidence.

**Current Teams composition (`693cfa888`, included in deployed `b9461c4a6`):**
Teams personal-file output is now wired to
the real service: source-derived recipient authority, atomic Board intent,
authenticated callback, staged worker, public receipt projection and audited
stage/version resolution. Server 73 includes its schema and runtime activation;
eligible-tenant live qualification remains blocked. A native committed-response
digest-format mismatch and a cold Board-send runtime initialization bug were
reproduced and fixed. Focused Board
and native-source suites pass 12/12 and 8/8. After fixing two scheduling
regressions caught by the first full run, the corrected full integration suite
passes 690/690 on a fresh database (134.68 seconds). The browser suite passes
31/31 with simulated provider/model ports; the final consent-copy rerun passes
2/2. Root inspected the waiting/mixed
receipt screenshots and shortened the repeated pre-send explanation in a
retained receipt. This is not live Teams consent/file qualification.

Completed follow-up in `b9461c4a6`: the review reproduced a conflict-state
liveness gap where Activity offered no action although the protocol could safely cancel. A
read-only, exact-scoped proof now offers only cancellation after ownership is
cleared or coherently expired; the versioned resolver remains authoritative.
Fresh protocol/projection tests pass 90/90, composed tests 39/39 and existing
UI/API tests 84/84. The combined follow-up passes the full 711-case suite.

Discord automatic registration is now composed with configure, resume and
runtime reconciliation in deployed `b9461c4a6`. Five root service tests pass,
including a process-reconstructed unknown POST settled by GET without reposting,
automatic upgrade, an external namespace conflict, and healthy Gateway
preservation on optional registration failure. The native command handler
passes 15 cases, the durable ownership/helper cohort 61, and the final combined
integration run 711/711 (142.31 seconds). Root runtime/helper tests pass 119/119
and the deterministic browser suite 31/31. The first full run's three fixture
isolation failures were fixed; its single Slack socket error did not reproduce
in isolation or the corrected run and is not claimed as a repaired provider bug.
Deployment and real command registration are verified above, separately from
these checks. The Mac lock prevents live command/UI qualification; the most
recent inventory was checked again after the restart.

### Earlier parallel checkpoints (historical, superseded by the deployment above)

The checkpoints below retain intermediate failures and evidence boundaries.
Their references to inactive hooks, pending integration or server 71/72 are
historical states, not current blockers. Current remaining work is listed above.

Pushed `f5698f533` isolates Teams expiry recovery and adds guarded Discord
command registration groundwork. Pushed `aacd4963f` adds the opt-in awaited
Discord command boundary; its private acknowledgement cannot become an ordinary
public publication receipt. Commands remain off pending durable service
registration/admission integration. Root independently passes its 125-case
runtime/Teams foundation cohort. The wireframe images remain removed.

**New maximal-capability audit, September 9:** the original goal is not met by
documenting every adapter omission as a fallback. Three concrete gaps now own
the next implementation pass:

- **Telegram video-note intake:** the pinned parser produces video attachments
  without filename/MIME, as permitted by Telegram's video-note schema. The
  default policy rejected them before download. A real parser-to-service test
  with a valid MP4 reproduced zero stored files. The narrowly scoped fix now
  binds provider-declared video-note identity to MPEG4 metadata; ordinary unknown
  files remain rejected. Final fresh-database regression: 6/6, including exact
  bytes after restart and current access revocation; adjacent parser/adapter/photo
  checks: 114/114; plain server TypeScript passed before the concurrent Discord
  edits. The new Telegram path is deployed on server 72 but not live qualified.
- **Discord native forms:** v6 now implements native text/select open/submit,
  current source/actor authorization, identical/conflicting duplicate handling
  and actor-scoped private correction/reopen. Existing endpoints automatically
  gain the capability after current runtime qualification. Actual lock-wait
  regressions cover retired/replaced runtimes and changed credential refs.
  Root's final full service run passes **641/641**; seven focused files pass
  **165/165**, including actual discord.js wire serialization. Provider I/O and
  scheduler remain simulated; real modal UI and native continuation still need
  live qualification. A modal submission cannot itself open another modal.
- **Teams personal file output:** existing bot credentials can support native
  consent/upload without new Graph permissions; the pinned adapter does not
  implement the consent callbacks. The new inactive helper/actual-SDK hook
  foundation passes root **81/81**, the owner's egress cohort **119/119**, and
  plain server types. It protects upload capability privacy, exact bytes and
  receipts, and uncertain delivery. The subsequent durable protocol now has
  encrypted early-accept buffering, restart restoration, versioned stage
  resolution and same-transaction projection hooks. Its fresh PostgreSQL
  cohort passes **115/115**, including a reproduced publication/transfer lock
  inversion and a conflicting callback during an owned card send. The original
  81-case foundation did not prove these durable properties. Worker/source
  integration and tenant qualification are still required before activation.
  Channel/group files retain their documented fallback; do not infer broader
  authority.

Root owns shared verification, documentation, Git and deployment. Server 72
loads the committed Discord/Telegram implementations at `739750c15`;
the new native modal and video-note journeys are not live qualified.
Teams durable transfer, schema, safe batch UI/API and runtime hooks
are integrated in the working tree but not deployed. Root owns shared
verification and migration review. Browser control still reports Mac
locked. Preserve all parallel edits; no lockfile or PR work is part of this pass.

**In-flight Teams activation checkpoint (after server 72 startup):**

- Durable-transfer owner: new `chat_teams_file_transfers` table and transfer
  service/tests, private encrypted event/capability restoration, early callbacks
  and versioned I/O receipts. Source comment/attachment IDs retain evidence
  without preventing normal deletion; each later effect must recheck the source.
- Runtime owner: optional authenticated consent callback and narrowly typed
  native consent/file-info sends inside the existing regional service-URL scope.
  No service registration or generic Adaptive Card conversion.
- UI/contracts owner: `awaiting_consent`, safe per-part transfer summaries,
  disjoint settled/outcome counts, whole-batch dismissal and version/phase
  preconditions. New fields are additive for rolling compatibility. Missing
  settlement evidence must keep the send identity, not unlock a duplicate send.
- Root next: connect API projections and stage-aware audited resolution, then
  current personal-recipient admission, worker intents/results and restart
  integration. An accepted consent card or PUT is never a published file.

Generated migration `0257_brave_living_mummy.sql` includes the new table,
publication company/ID unique index and `awaiting_consent` CHECK. Root moved
the generated parent unique-index creation before its dependent foreign key.
DB safety/types/build and a complete fresh migration chain passed on
`chat_teams_transfers_schema_20260909_root01`; table and CHECK were inspected.
This has **not** been applied to the live database. It is a passive schema and
protocol slice, not runtime activation. Logs:
`teams-file-transfer-db-build-0909.log` and
`teams-file-transfer-fresh-schema-root-0909.log`. The optional actual-SDK runtime
hook and strictly personal file-card methods pass **25/25**; their seven-file
cohort passes **223/223**. These use synthetic JWT/provider transport, not a
live tenant. The runtime hook stays unregistered until current recipient/source
authority is connected to the worker.

Root's read-only API projections and generic replay/resolution safety guards
pass **19/19** on fresh `chat_teams_projection_20260909_03`. A deliberately
wrong-conversation transfer first reproduced an Activity/batch disagreement;
the exact-scope join fixes it. These are seeded-state API proofs, not native
file delivery. The final UI cohort passes **101/101**, types/token gates pass,
and the two consent-specific browser cases pass **2/2** (13.9 seconds) on fresh
`chat_teams_consent_browser_20260909_03`. Browser publication responses are
mocked; actual task/file-upload controls and reload behavior are exercised.
These targeted runs were followed by the complete current 665-case service
and 31-case browser runs below.

Next integration boundaries are explicit: preserve a minimal authenticated
personal-recipient proof on new Teams deliveries, bind it to the current
processed delivery/principal/conversation generation, supply current source and
permission checks to every file stage, and atomically project real receipts.
The generic publication resolver currently refuses all transfer rows rather
than mislabel a consent card or PUT as delivered; dedicated stage resolution
must replace that guard before the new UI actions are activated. A card/file
send timeout does not prove that the provider request was cancelled.

Passive transfer/schema/runtime foundation is committed and pushed as
`146cf23b9`; server 72 still runs the earlier deployed code. A second standalone
helper cohort now passes root **103/103** on fresh
`chat_teams_projection_20260909_root01`: personal-recipient proof **35**, safe
batch projection **36**, and atomic publication projection **32**. The new
projection records per-attempt intent once, only links the actual final file
card, preserves explicit operator confirmation without inventing a native ID,
and defers affirmative no-I/O failures by 30 seconds. Its combined owner cohort
with encrypted transfer/SDK contracts passes **147/147**. These helpers do not
yet activate file delivery.

The proof validator checks actual pinned-parser personal activity fields but
does not authenticate JWTs or authorize users by itself. Original admission
must supply the verified runtime fence; retained-source checks must bind the
exact causal requester, not select an unrelated newer personal message. The
service's new admission/restart cases pass **3/3** with mocked runtime/transport.
The original normalized proof survives reconstruction exactly, denied reach
redacts it, and a proofless legacy receipt cannot acquire new authority.

Two further genuine worker regressions were reproduced and fixed in the
in-flight service integration: generic publication processing sent a pending
Teams transfer as ordinary text, and its 60-second stale sweep quarantined a
live 90-second Teams intent. Exact company/publication exclusions and a
publication-lock-before-lane-check fix both. The combined API/worker block now
passes **21/21** on fresh `chat_teams_worker_exclusion_20260909_green01`.
The full service run now passes **665/665**, zero skips, on fresh
`chat_teams_integration_20260909_root01` in **125.77 seconds**; the full
deterministic browser run passes **31/31**, zero retries, on fresh
`chat_teams_browser_20260909_root01` in **2.8 minutes**. Logs:
`teams-full-integration-root-0909.log` and `teams-browser-full-root-0909.log`.
The browser loaded the current UI/API work before the later generic-worker
exclusion fix; that worker fix is covered by the final 665-case service run.
Provider transport and model execution remain mocked. New Teams file delivery
is still not activated or live-qualified.

Final service-run source SHA256:
`dbb146cd5cc5494a0cd9026f102ba55f399556caca81d51204e75679e6e845c3`;
integration test SHA256:
`1907518eabc63e73a43489270642404ce7368eb379a9682f5050cdc28a4fa4d0`;
browser spec SHA256:
`d286a6daa1feacde14423044a8a8b0a2324fe217a13ff262313e5eb1648508d4`.
Root additionally passes **44/44** OpenAPI/batch contract tests and **95/95**
selected UI tests; the earlier owner's 101-case UI selection is a different
cohort. Plain server TypeScript and diff checks pass. The dedicated transfer
worker still needs current causal-source/recipient authority, stage resolver,
expiry-recovery scheduling and per-row sweep failure isolation. Do not expose
stage actions with the generic resolver or treat an expired send lease as proof
that no file/card was delivered.

Standalone projection/recipient helpers are committed and pushed as
`e9099b5c4`. The shared service/API/UI activation work remains uncommitted and
preserved. No server restart, live database migration, runner staging or live
provider message occurred during this pass. Lockfile and runner SHA remain
unchanged.

The September 9 browser inventory still reports the Mac lock screen,
not a Discord login failure. Loopback/private health is ready on server 72; the
05:00:24 UTC check has 290 terminal runs and no active run, latest start
02:15:47.812 UTC.
No new live provider conversation has been sent during this audit pass.

Discord's generated question card → parsed concurrent clicks → real service/DB
→ one continuation publication now passes on a fresh database. The Slack
signed `view_submission` bridge passes 10/10; its final callback is a pure
validator/observer. A separate signed adapter/runtime-to-real-service/DB case
now covers invalid submission consuming SDK context, revoked-user denial,
restored operator correction and duplicate no-op. Its three-case database
cohort and 140 adjacent tests pass; root's full 625-case regression passes in
125.87 seconds on fresh `chat_slack_modal_joined_20260909_root01`. The final
test-only teardown adjustment separately passes all three focused database
cases and plain server TypeScript. The case proves one durable
`wake_fallback` receipt and simulated scheduler call, not a native model turn.
Provider I/O and model execution remain explicitly simulated, not newly
qualified live journeys.

The Teams `task/fetch`/`task/submit` bridge found a genuine error-only card that
removed the original inputs and Submit after invalid answers. A frozen repair
rebuilds only current authorized invalid forms with known bounded draft values
and readable question labels. Slack inline errors and all stale/denied guards
stay unchanged. Helper/Teams tests pass 31/31; independent helper/Teams/Slack
review passes 41/41; real-service Slack/Teams invalid-form cases pass 2/2.
The fresh full database regression passes 624/624, zero skips, in 120.61 seconds
on `chat_modal_correction_20260909_root01`; root's helper/Teams/Slack repeat
passes 41/41 and plain server TypeScript passes.
The Teams JWT checker is an explicit test double, not eligible-tenant proof.
The repair is deployed on server 71, with healthy Board and connected Discord
Gateway. No new live provider conversation or Teams tenant proof is implied.

- **Telegram photo eligibility (complete):** bounded PNG/JPEG metadata selects
  photo within supported geometry and a conservative 10,000,000-byte budget.
  Other images retain original document bytes. Header screening never decodes
  pixels. Valid fixtures, malformed headers and exact limits pass through the
  pinned adapter. Ambiguous photo sends are never retried as documents.
  Independent review's JPEG component-header cases are fixed.
- **Webhook diagnostics (complete):** portable tests pass 6/6 and root's actual
  wired-source HTTP tests pass 8/8, including keep-alive, native parser errors,
  privacy, 1 MiB ceiling and the explicit QA fault fixture. Deployed above.
  This closes a diagnostic gap, not the cause of earlier pre-ingress delays.
- **Discord interactions (complete):** real normalization strips raw methods
  used by the old denial check. Runtime-owned context now selects rejection
  after durable denial; foreign-guild actions no longer success-ACK. Forged
  payload markers and concurrent webhook context cannot supply that context.
  Real adapter → runtime → service → DB regressions pass, including one denial
  row and no wakeup for repeated synthetic delivery. Simulated socket/API
  results are not live Discord button qualification.
- **Native reasoning effort (audit complete):** legacy `modelReasoningEffort`
  is not a supported field in the closed native v4 provider contract. The five
  latest succeeded runs freeze `{kind: codex, model: gpt-5.6-luna,
approvalPolicy: never}`. Injecting an effort field is rejected; resolving
  legacy low versus high yields the same native profile. This is a missing
  native capability, not a proved dropped supported setting. A future explicit
  versioned contract addition needs frozen identity, new/resumed turn coverage
  and real qualification. Do not silently map the legacy field or claim low
  effort is effective today.

The latest user reports Discord login restored; root's subsequent browser probe
still reports **Mac locked**. Only the OS unlock is being requested. Root
rechecked server 75 health and its 3137 listener; no new live provider turn
has been sent during this code-only audit.

## Latest provider evidence — scope matters

Maya E2E `31f56712-3944-423e-b7c7-404bb8fbb993`, company
`7ffa9799-0b1b-4a26-9b44-8e897f832f89`, uses native
`paperclip_runner` / `codex_app_server` / `gpt-5.6-luna`. Terra was not
substituted. Effective reasoning effort is not yet proved; the old configured
low field is outside the native v4 contract. Do not claim it is running low effort.

| Provider | Latest useful real evidence                                                                                                           | Still missing                                                                          |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Discord  | Server 68 same-thread image/TXT return on CHA-32; both previews and full TXT inspected, one attempt per output; bot reconnected on 75 | Live repeat on current deployment, remaining runbook cases, second-process takeover    |
| Slack    | Server 68 same-thread image/TXT return on CHA-33; exact received bytes retained; live edited-source reuse denied                      | Live repeat on current deployment, remaining lifecycle/governance/failure permutations |
| GitHub   | Server 68 honest unavailable-private-file reply, followed by correct pasted-text answer on the same session                           | New safe task-link → task-upload live journey and remaining runbook cases              |
| Telegram | Earlier real text/media/reaction/backlog cases; accepted CHA-26 image answer later delivered without another model run                | Exact failed document-B recovery and remaining file/interaction/performance cases      |
| Teams    | Deterministic personal-file consent, channel/group pictures, progress, actions, access and safe file-link coverage                    | Actual qualified tenant setup and live provider journeys                               |

Real media repeats on server 68 were descriptive, not a controlled speed claim:
Discord run `265d35e0-af1e-421b-b3e2-61ba65fcc288` took 60.073 seconds,
source→last file 64.926 seconds; Slack
`12d6d924-9748-4d13-ad6e-2035937e12dd` took 51.030 seconds,
source→last file 61.173 seconds. Each was sent after the previous run settled
to avoid same-agent queue contention. See permanent log for source/message IDs.

GitHub generic private attachment URLs can be unavailable to the App even when
the signed-in human can read them. Never forward browser cookies or guess file
contents. The new deterministic fallback appends an authorized Paperclip task
link; it does not make those provider files generically downloadable.

Slack once took about 61.5 seconds and Telegram once 234.435 seconds before
local ingestion. Later samples were fast without configuration changes.
Those delays are localized, not explained or fixed. Unauthenticated retry
headers are diagnostic hints, not authority or proof of earlier request paths.

## Protected historical failures

These are not unlocked by the forward warm-transition or startup fixes.
Do not infer full process-tree retirement from a missing PID or leader exit,
clear quarantine, rewrite receipts, reset history or replay accepted output.

### Telegram CHA-26: preserve exact failed B

- Task `ab55427f-615e-4a2d-819a-8af9c1292fa3`, generation 10.
- Accepted A: `fd7011b6-323b-461a-bc43-a81835bece5f`; external messages 153/154
  were presented once without rerunning A.
- Failed document B: **`fcf7adc4-39a5-4c42-8cbb-a9723ad22302`**. Only its
  exact authorized retry can qualify recovery; do not create replacement C.
- Native session `ce94db0c-3aec-40be-8caa-c80d008fcbbb`;
  runner `0c1da1cb-513b-4ab9-8e28-4466ac060016`;
  lease `ae666e16-338c-400a-bc9b-7792f97c1770`;
  provider thread `01a08176-e3a3-7891-b06f-439b9e68b641`.
- Scope `1c080549b2c4f48602d28768e62c56bbc50d48c4479e8abd8fc054a498f4b391`.
- Latest cleanup copy `cleanup-BufsxY`; maintenance
  `native-cleanup:ae644c98-7ecd-483a-bb3e-ecccbf0bb42a`.
  Epoch 0 PID 88642 has retirement; epoch 1 PID 88736 lacks the required
  authenticated retirement receipt. Absence does not supply it.

Earlier CHA-24 had damaged historical event 44. A Board retry accidentally
selected its older UUID-keyed context and is not damaged identifier-keyed
recovery. Its retired conversation generation must not regain external access.

### Discord CHA-29: preserve old accepted owner

- Task `5448a71e-4303-425a-8fbe-f66ae4a9482b`;
  thread `1547036525059907626`.
- Accepted A `29d19d67-9591-469d-ada3-f72261b732d0`,
  result `e9700900-7e55-4716-8812-409600d679b8`;
  failed B `6b6f6db4-7d3b-4b40-beb7-f385cb610cbc`.
- Native session `1c2c4bbc-8416-46ff-960d-f0f72eef3862`;
  runner `75630d5c-ddae-4c3c-b1a4-86c707b4fbc5`;
  provider thread `01a08380-cfca-7ea2-ba46-6a8a8ae678ed`.
- Scope `e88d6c2a0bee3c91af49d155d63ce2ad043975ecf51cae77b5e1129a5688ae37`.
- Archive suffix `identity_indeterminate.cleanup.1ad3d873-71c2-47aa-9d7d-74407d75d311`;
  failed copy `cleanup-mZx1xU`; maintenance
  `native-cleanup:75e0faf7-bc67-4a4b-b206-ce0c0f4340be`.
  Runner PID 69543 retired, but renewed provider retirement is unproved.
  Do not retry the original or failed copy on that fact alone.

## Completed repairs — do not reimplement

- Experimental chat gate preserves production GitHub tools when chat is off.
- Ambiguous outbound delivery has explicit audited resolution; ordinary replay
  refuses unknown delivery. Board send+comment creation is atomic/idempotent.
- Exact failed-run retries derive source/context on the server, preserve the
  admitted batch, dedupe retry intent and recheck current authority. UI surfaces
  use that route; they no longer need a new generic retry implementation.
- Accepted-result presentation is separate from physical session reuse and
  preserves later task state and audit evidence.
- Current-source attachment revocation, native byte-preserving file output,
  media batching guidance, whole-message sizing and truthful status repairs
  have focused and scenario-specific live evidence in the permanent log.
- GitHub unavailable-file task links are durably prepared and reauthorized.
  Task navigation/uploads bind the loaded task's company; outgoing route and
  file-chooser readiness are fenced. Narrow connected-task banners are fixed.
- Warm run handoff has immutable receipt/result/ACK boundaries and final
  activation acknowledgment. Old authority is replay-only. Fresh recovery
  preserves the same lease and requires independently verified server ownership.
- Recovery-only authorization retires only after a fresh exact new-authority
  snapshot. Missing/wrong results and sync/async callback failure keep ordinary
  work fenced, including requests racing bootstrap.
- The event pump is fenced by run identity; local cursors reset after confirmed
  activation. Remote FIN closes the owned WebSocket wire.
- Forward startup ownership receipts prevent unproved relaunches. None of
  these repairs retroactively authorizes historical cleanup.

## Verified automated gates and limitations

Latest combined service integration passes **711/711**, no skips, on fresh
`chat_commands_full_20260909_root02` (142.31 seconds). Final runtime/helper
tests pass **119/119**, and deterministic Board browser tests **31/31**, zero
retries (2.8 minutes), on `chat_commands_browser_20260909_root01`. Plain server
TypeScript passes. These cover the deployed implementation with mocked
provider/model ports, not a live command or Teams consent journey. Earlier
cohorts below retain their original narrower scope; the permanent log records
both the first failed combined run and the corrected run's exact source hashes.

On the frozen native candidate: optimized full transport **133/133** (zero
skips, 198.64 seconds), controller **69/69**, optimized Rust lib **248/248**,
and the Codex/native/supervisor/durable integration targets passed.
Root independently passed **26/26** recovery cases, **36/36** generated server
admission, **75/75** adjacent server tests, plus post-format **55/55** selected
protocol cases and **260/260** executor tests. Package TS build/types, direct
server types and Rust formatting pass. Formatting is scoped; some preexisting
files are not globally Prettier-clean.

Generated server admission uses the actual checkpoint rebind and restart
classifier with real PostgreSQL, but mocks the backend after admission.
It is not combined server→real-provider recovery proof. Only local Codex
`resume_dead_runner` with a verified managed/projectless checkpoint is admitted;
surviving-runner, remote/listen and missing-independent-checkpoint cases remain
unsupported and fail closed.

Earlier Discord modal workflow integration **641/641**, zero skips, ran on fresh
`chat_discord_modal_final_20260909_root02` (123.87 seconds). Root's focused
seven-file cohort passes **165/165** and plain server TypeScript passes.
The first full attempt passed 637/638 because a fixture's unscoped initialization
hook changed the target generation before its own initialization. The hook is
now endpoint-scoped with an exact invocation assertion; the negative capability
assertion is unchanged. Three separate real lock-wait bugs were reproduced and
fixed. Source hashes and exact simulated-vs-live boundaries are in the permanent
log. New Teams durable-integration work is separate and not covered by that run.

The preceding frozen-foundation chat integration **631/631**, zero skips, ran on fresh
`chat_modal_telegram_foundation_20260909_root01` (119.53 seconds). It includes
the Telegram video-note repair and Discord's modal transport foundation with
capability still off, not the subsequent Discord service/correction workflow.
The exact loaded source hashes are in the permanent log. A later test-only
global-collector setup/cleanup correction passes GitHub-filtered **149/149**
(482 other cases filtered) on a second fresh database; this does not change
production behavior. GitHub attachment/stress/setup units pass **182/182**;
the shared Slack/Teams/modal-helper cohort passes **41/41**.

The preceding full chat integration **625/625**, zero skips, ran on fresh
`chat_slack_modal_joined_20260909_root01` (125.87 seconds). A later test-only
nested-cleanup/fixture-retirement adjustment passes the final-source focused
Slack/Teams **3/3** and plain server TypeScript; the full run loaded the prior
semantic freeze, not that cleanup delta.
Root's focused helper/Teams/Slack cohort passes **41/41** and direct server
types pass. The earlier parser/runtime/adapter cohort passed **199/199**.
The full suite includes Slack's signed corrected-modal/database flow,
Teams invalid-form preservation, Discord's parsed
question/denial paths, Telegram photo boundaries, and previous Slack/Discord
partial-file batches across restart and explicit ambiguous-file resolution.
Provider I/O is simulated. Prior log: `slack-signed-modal-full-root-0909.log`
in ignored runtime.

Full deterministic chat browser **29/29**, zero retries (2.8 minutes), includes
six task-company/upload routes and readiness behavior. It is not live provider
qualification. The real-Codex staged startup canary
`paperclip-real-startup-phHTMj` used actual Codex 0.153.4, one provider process
and no model turn; reopen made no new provider RPC. Direct-child exit was
observed, not whole-tree retirement.

Broad workspace tests previously had unrelated harness/runtime failures; never
claim the entire workspace passed from these focused gates. Renew final-source
installation/build/release gates when appropriate; do not substitute PR/CI work
for remaining provider qualification.
