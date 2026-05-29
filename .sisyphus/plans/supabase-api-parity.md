# Supabase API Parity Plan

## TL;DR
> **Summary**: Reconcile the React app's Supabase client usage and generated types with the live Supabase MCP schema. This is parity-only: no migrations, no RLS/security remediation, no Edge Function creation, and no new test/typecheck/CI infrastructure.
> **Deliverables**:
> - Live-schema-aligned Supabase usage across all app flows
> - `src/integrations/supabase/types.ts` reconciled with the live public schema
> - No stale `public.users` usage
> - No calls to nonexistent Edge Functions
> - Existing gates pass: `npm run lint`, `npm run build`
> **Effort**: Medium
> **Parallel**: YES - 3 waves
> **Critical Path**: Task 1 → Tasks 2/3/4 → Task 5 → Task 6 → Final Verification Wave

## Context
### Original Request
Make sure the Supabase API implementation is working properly and is 1-to-1 with the system, using Supabase MCP.

### Interview Summary
- Scope selected by user: **Parity only**.
- RLS/security selected by user: **Demo-only accept risk**. Document RLS/security findings, but do not remediate them.
- Verification selected by user: **Use existing gates only**. Do not add test framework, test files, typecheck script, CI, or Playwright config.
- 1:1 definition selected by user: **Full API-schema parity**. Every Supabase table call, generated type, and referenced function must match live MCP state.

### Metis Review (gaps addressed)
- Add explicit guardrails preventing security, migration, Edge Function, and testing scope creep.
- Treat live Supabase MCP schema as the source of truth; treat generated TypeScript types as stale until reconciled.
- Define stale `users` mapping rule: donor profile data maps to `donors`; account/session identity remains Supabase Auth API data.
- Define missing Edge Function handling: remove/disable the impossible `delete-user-account` path; do not create/deploy an Edge Function.
- Include static parity audit acceptance criteria because build success alone does not prove runtime Supabase query validity.

### Oracle Review (risks addressed)
- This is a schema-contract cleanup, not a feature/security project.
- Snapshot live schema before implementation.
- Audit all Supabase `.from`, `.select`, `.insert`, `.update`, `.eq`, `.order`, `.rpc`, and `functions.invoke` usage.
- Do not fix stale app assumptions by changing the database.

## Work Objectives
### Core Objective
Make repository Supabase usage and generated types match the live Supabase MCP system exactly, without changing the database schema or adding infrastructure.

### Deliverables
- Source audit proving all Supabase calls reference live tables/columns/functions only.
- Updated `src/integrations/supabase/types.ts` that reflects the live public schema.
- Updated app code where stale `users` and missing Edge Function assumptions currently break parity.
- Existing verification gates and agent QA evidence.

### Definition of Done (verifiable conditions with commands/tools)
- Supabase MCP `list_tables(public, verbose=true)` confirms live public schema still contains these 11 tables: `blood_product_types`, `blood_request_items`, `blood_requests`, `blood_units`, `donation_drives`, `donations`, `donors`, `hospitals`, `prc_centers`, `shipment_items`, `shipments`.
- Supabase MCP `list_edge_functions` confirms no Edge Functions exist, and source contains no `supabase.functions.invoke(` dependency.
- Grep over `src/**/*.{ts,tsx}` finds no `supabase.from("users")`, `supabase.from('users')`, or generated `users:` table definition in `src/integrations/supabase/types.ts`.
- `src/integrations/supabase/types.ts` contains all 11 live tables and does not include `blood_product_types.description` unless a fresh MCP schema check proves that column exists.
- `npm run lint` exits 0.
- `npm run build` exits 0.

### Must Have
- Live Supabase MCP schema is the only database contract.
- `donors` is used for donor profile/list/dashboard/register data.
- Supabase Auth APIs remain responsible for session/account identity.
- Missing donor row behavior must be graceful: no crash; show empty/error state already consistent with existing toast/error patterns.
- Missing Edge Function behavior must be graceful: remove/hide/disable account deletion flow or show a clear unavailable message without invoking an Edge Function.

### Must NOT Have
- MUST NOT create migrations.
- MUST NOT add/alter/drop tables, columns, triggers, functions, RLS policies, grants, or Edge Functions.
- MUST NOT remediate accepted RLS/security advisories in this plan.
- MUST NOT add test framework, test files, typecheck script, CI, or new quality gates.
- MUST NOT create a `users` table or reintroduce stale `users` types.
- MUST NOT preserve calls to nonexistent Edge Functions.
- MUST NOT broaden into auth redesign, security hardening, or product feature work.

## Verification Strategy
> ZERO HUMAN INTERVENTION - all verification is agent-executed.
- Test decision: existing gates only; no test framework exists and user chose not to add one.
- QA policy: Every task has agent-executed static/runtime scenarios.
- Evidence: `.sisyphus/evidence/task-{N}-{slug}.{ext}`
- Required gates: `npm run lint`, `npm run build`.

## Execution Strategy
### Parallel Execution Waves
> Target: 5-8 tasks per wave. This plan has fewer tasks because work is tightly coupled around one Supabase contract.

Wave 1: Task 1 foundation audit/snapshot.
Wave 2: Tasks 2, 3, 4 can run after Task 1 because they touch separate concerns: types, `users` donor/profile flows, missing Edge Function.
Wave 3: Tasks 5 and 6 finalize remaining parity and verification.

### Dependency Matrix (full, all tasks)
| Task | Depends On | Blocks |
|---|---|---|
| 1. Snapshot and audit Supabase contract | None | 2, 3, 4, 5, 6 |
| 2. Reconcile generated Supabase types | 1 | 5, 6 |
| 3. Replace stale `users` table usage | 1 | 5, 6 |
| 4. Remove missing Edge Function dependency | 1 | 5, 6 |
| 5. Audit/fix remaining Supabase query parity | 1, 2, 3, 4 | 6 |
| 6. Run existing gates and route QA | 1, 2, 3, 4, 5 | Final Verification |

### Agent Dispatch Summary (wave → task count → categories)
- Wave 1 → 1 task → `deep`
- Wave 2 → 3 tasks → `quick`, `deep`, `quick`
- Wave 3 → 2 tasks → `deep`, `unspecified-high`

## TODOs
> Implementation + Test = ONE task. Never separate.
> EVERY task MUST have: Agent Profile + Parallelization + QA Scenarios.

- [ ] 1. Snapshot live Supabase contract and source usage audit

  **What to do**: Capture the live public schema from Supabase MCP and build the exact source-side Supabase API inventory. Audit every `src/**/*.{ts,tsx}` reference to `supabase.from(`, `.select(`, `.insert(`, `.update(`, `.delete(`, `.eq(`, `.order(`, `.rpc(`, `supabase.functions.invoke(`, and `Database["public"]`. Create an implementation note in `.sisyphus/evidence/task-1-supabase-contract.md` listing live tables/columns/enums, usage files, stale references, and accepted out-of-scope advisories.
  **Must NOT do**: Do not edit source code. Do not run DDL. Do not create migrations, RLS policies, Edge Functions, tests, or scripts.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: requires cross-checking live MCP schema against multiple source files.
  - Skills: `supabase-postgres-best-practices` - to avoid accidental schema/security anti-patterns while auditing.
  - Omitted: `vercel-react-best-practices` - no React implementation in this audit task.

  **Parallelization**: Can Parallel: NO | Wave 1 | Blocks: 2, 3, 4, 5, 6 | Blocked By: none

  **References**:
  - Supabase MCP: live public tables from planning research: `blood_product_types`, `blood_request_items`, `blood_requests`, `blood_units`, `donation_drives`, `donations`, `donors`, `hospitals`, `prc_centers`, `shipment_items`, `shipments`.
  - Client: `src/integrations/supabase/client.ts:5-16` - env keys and typed client creation.
  - Types: `src/integrations/supabase/types.ts:17-398` - stale generated schema includes `users` and stale `blood_product_types.description`.
  - Known source usage inventory: `src/pages/home/home.hook.tsx`, `src/hooks/use-blood-requests.ts`, `src/hooks/use-blood-inventory.ts`, `src/pages/home/components/ScheduleDrive.tsx`, `src/pages/home/components/ScheduleDonationModal.tsx`, `src/pages/home/components/DriveDetails.tsx`, `src/pages/Inventory/inventory.hook.tsx`, `src/pages/blood-requests/requests.hook.tsx`, `src/pages/Inventory/components/RecordNewUnit.tsx`, `src/pages/Account.tsx`, `src/pages/blood-requests/components/UpdateRequest.tsx`, `src/pages/blood-requests/components/FulfillRequest.tsx`, `src/pages/blood-requests/components/CreateRequest.tsx`, `src/pages/donor/donor.hook.tsx`, `src/pages/auth/register.hook.tsx`, `src/pages/auth/auth.context.tsx`, `src/pages/Profile.tsx`.

  **Acceptance Criteria**:
  - [ ] `.sisyphus/evidence/task-1-supabase-contract.md` exists and lists every Supabase usage file and every live public table.
  - [ ] Evidence states that RLS/security warnings are accepted out of implementation scope.
  - [ ] Evidence states that migrations and Edge Functions were unchanged.

  **QA Scenarios**:
  ```
  Scenario: Live schema snapshot is complete
    Tool: Supabase MCP
    Steps: Run list_tables for public schema with verbose=true; run list_edge_functions; run list_migrations.
    Expected: 11 public tables listed; no Edge Functions; no migrations; evidence file records the result.
    Evidence: .sisyphus/evidence/task-1-supabase-contract.md

  Scenario: Source audit catches known stale references
    Tool: Grep
    Steps: Search src for from("users"), from('users'), and supabase.functions.invoke(.
    Expected: Evidence records current stale users references and Account Edge Function reference before later tasks fix them.
    Evidence: .sisyphus/evidence/task-1-source-audit.md
  ```

  **Commit**: NO | Message: `n/a` | Files: none

- [ ] 2. Reconcile generated Supabase types to live schema

  **What to do**: Update `src/integrations/supabase/types.ts` so it matches the live Supabase MCP public schema. Preferred path: use Supabase type generation if available without changing project setup; fallback: manually reconcile the generated file from MCP schema. Ensure the `users` table type is removed/replaced by `donors`, all 11 live tables are represented, enum names/values match live MCP output, and `blood_product_types.description` is removed unless a fresh MCP check proves it exists.
  **Must NOT do**: Do not treat existing `types.ts` as authoritative. Do not add fake tables/columns to satisfy app code. Do not add scripts or dependencies.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: bounded generated-type reconciliation after Task 1 contract is known.
  - Skills: `supabase-postgres-best-practices` - to preserve schema contract accuracy.
  - Omitted: `vercel-react-best-practices` - no React rendering changes.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 5, 6 | Blocked By: 1

  **References**:
  - Current client typing: `src/integrations/supabase/client.ts:2-11` - imports `Database` and creates typed Supabase client.
  - Stale type: `src/integrations/supabase/types.ts:17-23` - includes `blood_product_types.description`, absent from live MCP schema during planning.
  - Stale type: `src/integrations/supabase/types.ts:333-398` - defines `users`, absent from live MCP schema during planning.
  - Live schema source: Supabase MCP public schema snapshot from Task 1.

  **Acceptance Criteria**:
  - [ ] `src/integrations/supabase/types.ts` has no `users:` table definition under `public.Tables`.
  - [ ] `src/integrations/supabase/types.ts` includes `donors` with live columns including `donor_id`, `first_name`, `last_name`, `date_of_birth`, `blood_type`, `contact_number`, `email`, `address`, `city`, `province`, `zip_code`, `eligibility_status`, `last_donation_date`, `created_at`, `updated_at`, and `isAdmin` exactly as live MCP reports.
  - [ ] `src/integrations/supabase/types.ts` does not include `blood_product_types.description` unless live MCP schema was rechecked and includes it.
  - [ ] No package scripts/dependencies are added.

  **QA Scenarios**:
  ```
  Scenario: Generated types match live tables
    Tool: Grep + Supabase MCP
    Steps: Compare Task 1 live table list with public.Tables in src/integrations/supabase/types.ts.
    Expected: All 11 live tables are present; users is absent; no extra public table types that MCP does not report.
    Evidence: .sisyphus/evidence/task-2-types-parity.md

  Scenario: Stale columns are not preserved
    Tool: Grep
    Steps: Search src/integrations/supabase/types.ts for "description:" inside blood_product_types and for "users:".
    Expected: Neither stale item is present unless Task 1 MCP evidence proves otherwise.
    Evidence: .sisyphus/evidence/task-2-types-stale-check.txt
  ```

  **Commit**: NO | Message: `n/a` | Files: `src/integrations/supabase/types.ts`

- [ ] 3. Replace stale `users` table usage with donor/Auth-compatible behavior

  **What to do**: Update all stale `public.users` table calls. Use `donors` for donor profile/list/dashboard/register fields. Use Supabase Auth session/user APIs only for identity/session data. Preserve current UI behavior as much as possible. Specific required mappings: dashboard active donor count queries `donors.eligibility_status`; donor list/search/delete queries `donors`; registration donor details insert into `donors` after Auth sign-up succeeds; profile fetch/update by authenticated email against `donors.email`; auth profile lookup from `donors.email` with admin mapping from live column `isAdmin` to the app's expected admin boolean.
  **Must NOT do**: Do not create a `users` table. Do not invent columns such as `is_admin` or `is_hospital_staff` if live MCP does not report them. Do not redesign authentication.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: `users` semantics cross auth, dashboard, profile, donor admin, and registration flows.
  - Skills: `vercel-react-best-practices` - to preserve React hook/state behavior while changing data access.
  - Omitted: `supabase-postgres-best-practices` - Task 1/2 provide the schema contract; this task is app integration.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 5, 6 | Blocked By: 1

  **References**:
  - Dashboard stale count: `src/pages/home/home.hook.tsx:30-41` - change `from("users")` to `from("donors")` and keep `eligibility_status = "Eligible"` if live enum supports it.
  - Donor admin stale list/delete: `src/pages/donor/donor.hook.tsx:42-90` - change count/list/delete from `users` to `donors`.
  - Auth profile stale lookup: `src/pages/auth/auth.context.tsx:68-78` - change profile lookup from `users` to `donors`; map live `isAdmin` to local `is_admin` if local context expects that shape.
  - Registration stale insert: `src/pages/auth/register.hook.tsx:171-187` - insert donor details into `donors`.
  - Profile stale fetch/update: `src/pages/Profile.tsx:50-107` - query/update `donors` by normalized email.
  - Live schema source: Supabase MCP `donors` table from Task 1.

  **Acceptance Criteria**:
  - [ ] No `from("users")` or `from('users')` remains in `src/**/*.{ts,tsx}`.
  - [ ] No code references `users` as a Supabase table.
  - [ ] Donor profile fields use columns that exist in live `donors` schema.
  - [ ] Auth/session code still uses `supabase.auth.*` for sign-up/sign-in/session/sign-out.
  - [ ] Missing donor row produces an existing-style toast/error/empty state, not an uncaught crash.

  **QA Scenarios**:
  ```
  Scenario: Stale users table is gone
    Tool: Grep
    Steps: Search src/**/*.{ts,tsx} for from("users"), from('users'), and .from(`users`).
    Expected: Zero matches.
    Evidence: .sisyphus/evidence/task-3-no-users-table.txt

  Scenario: Donor/Auth split is preserved
    Tool: Grep + Read
    Steps: Inspect auth.context.tsx, register.hook.tsx, Profile.tsx, donor.hook.tsx, and home.hook.tsx.
    Expected: donor profile/list/register data uses donors; session/sign-in/sign-up/sign-out continues to use supabase.auth APIs.
    Evidence: .sisyphus/evidence/task-3-donor-auth-split.md
  ```

  **Commit**: NO | Message: `n/a` | Files: `src/pages/home/home.hook.tsx`, `src/pages/donor/donor.hook.tsx`, `src/pages/auth/auth.context.tsx`, `src/pages/auth/register.hook.tsx`, `src/pages/Profile.tsx`

- [ ] 4. Remove or disable nonexistent Edge Function account deletion path

  **What to do**: Update `src/pages/Account.tsx` so it no longer invokes `delete-user-account`, because Supabase MCP reports no Edge Functions. Parity-only required behavior: keep password update/reset flows intact; for account deletion, disable or hide the destructive delete action and show a clear unavailable message such as `Account deletion is unavailable in this Supabase project because no delete-user-account Edge Function is deployed.` Prefer the smallest UI/code change that prevents runtime invocation of the missing function.
  **Must NOT do**: Do not create, deploy, or plan a new Edge Function. Do not perform client-side admin deletion. Do not add service-role keys or privileged secrets to the frontend.

  **Recommended Agent Profile**:
  - Category: `quick` - Reason: single-file change with clear forbidden API call.
  - Skills: `vercel-react-best-practices` - to preserve UI state and avoid broken forms.
  - Omitted: `supabase-postgres-best-practices` - no SQL/schema work.

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: 5, 6 | Blocked By: 1

  **References**:
  - Missing function call: `src/pages/Account.tsx:136-143` - currently invokes `delete-user-account`.
  - Protected route: `src/App.tsx:60-66` - `/account` is auth-required.
  - Live function source: Supabase MCP `list_edge_functions` from planning research and Task 1 returns no functions.

  **Acceptance Criteria**:
  - [ ] `src/pages/Account.tsx` contains no `supabase.functions.invoke(` call.
  - [ ] No source file invokes `delete-user-account`.
  - [ ] Account deletion UI cannot trigger a network request to a nonexistent Edge Function.
  - [ ] Existing password reset/update/sign-in reauth code is not broadened beyond what is necessary.

  **QA Scenarios**:
  ```
  Scenario: Missing Edge Function is not invoked
    Tool: Grep
    Steps: Search src for supabase.functions.invoke( and delete-user-account.
    Expected: Zero runtime invocation references remain.
    Evidence: .sisyphus/evidence/task-4-no-edge-invoke.txt

  Scenario: Account deletion has graceful unavailable behavior
    Tool: Read
    Steps: Inspect src/pages/Account.tsx around the former delete handler and delete UI.
    Expected: The UI is disabled/hidden or displays a clear unavailable message; it does not call a missing function.
    Evidence: .sisyphus/evidence/task-4-account-unavailable.md
  ```

  **Commit**: NO | Message: `n/a` | Files: `src/pages/Account.tsx`

- [ ] 5. Audit and fix remaining Supabase query/table/column parity

  **What to do**: After Tasks 2-4, re-audit every Supabase call in all 17 app usage files: 16 table-usage files plus `src/pages/Account.tsx` for the missing Edge Function path. Fix any remaining table, column, enum, nested select, order, filter, insert, update, delete, or function mismatch against live MCP schema. Confirm the existing live-table flows remain valid: home inventory/drives, donation scheduling/details, inventory requests, blood request create/update/fulfill, record new unit, hospitals/product types/centers lookup, and account page missing-function handling. Remove app references to columns/functions absent from live schema rather than adding database objects.
  **Must NOT do**: Do not alter database schema to satisfy stale code. Do not rewrite unrelated UI. Do not add test infra.

  **Recommended Agent Profile**:
  - Category: `deep` - Reason: requires full source-to-schema parity across multiple modules.
  - Skills: `supabase-postgres-best-practices` - to verify table/column/enums accurately.
  - Omitted: `vercel-react-best-practices` - UI work should be minimal and parity-driven.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: 6 | Blocked By: 1, 2, 3, 4

  **References**:
  - Blood requests hook: `src/hooks/use-blood-requests.ts:1-8` - `hospitals` query.
  - Blood inventory hook: `src/hooks/use-blood-inventory.ts:18-19` - `blood_units` query.
  - Inventory overview: `src/pages/Inventory/inventory.hook.tsx:24-25` - `blood_requests` query.
  - Record unit: `src/pages/Inventory/components/RecordNewUnit.tsx:48-86` - `donations`, `blood_product_types`, `prc_centers`, `blood_units`.
  - Blood request create/update/fulfill: `src/pages/blood-requests/components/CreateRequest.tsx:77-137`, `src/pages/blood-requests/components/UpdateRequest.tsx:88-202`, `src/pages/blood-requests/components/FulfillRequest.tsx:65-77`.
  - Donation drive flows: `src/pages/home/components/ScheduleDrive.tsx:45-46`, `src/pages/home/components/ScheduleDonationModal.tsx:58-94`, `src/pages/home/components/DriveDetails.tsx:30-127`.
  - Live schema source: Supabase MCP snapshot from Task 1.

  **Acceptance Criteria**:
  - [ ] Every `.from("table")` table exists in live MCP public schema.
  - [ ] Every selected/inserted/updated/filtered/ordered column exists on the target live table.
  - [ ] No `.rpc(` call exists unless the live MCP schema reports that function.
  - [ ] No `supabase.functions.invoke(` call exists unless Supabase MCP reports that Edge Function.
  - [ ] Static audit evidence lists each of the 17 Supabase app usage files and verdict `PASS`.

  **QA Scenarios**:
  ```
  Scenario: Full Supabase source parity audit passes
    Tool: Grep + Read + Supabase MCP
    Steps: Re-scan src for Supabase calls; compare every table/column/function against Task 1 MCP schema.
    Expected: Every usage file receives PASS in evidence; no nonexistent table/column/function reference remains.
    Evidence: .sisyphus/evidence/task-5-full-parity-audit.md

  Scenario: Empty/live data edge cases do not crash obvious flows
    Tool: Browser/Playwright if available, otherwise interactive_bash dev server plus browser-capable agent
    Steps: Start dev server; visit `/`, `/donor-register`, `/donor-login`, `/drive/1`; for protected routes `/profile`, `/account`, `/donors`, `/inventory`, `/requests`, `/schedule-drive`, `/create-request`, verify unauthenticated redirect to `/donor-login` where applicable.
    Expected: No console/network errors mentioning missing relation `users`, missing column `description`, or missing Edge Function `delete-user-account`.
    Evidence: .sisyphus/evidence/task-5-runtime-routes.md
  ```

  **Commit**: NO | Message: `n/a` | Files: all Supabase usage files as needed

- [ ] 6. Run existing gates and package final parity evidence

  **What to do**: Run only the user-approved existing gates, collect final evidence, and summarize accepted risks. Required commands: `npm run lint` and `npm run build`. Re-run final static searches for `users`, `supabase.functions.invoke`, and stale generated type columns. Save consolidated evidence to `.sisyphus/evidence/task-6-final-parity.md`.
  **Must NOT do**: Do not add or run new test/typecheck/CI infrastructure. Do not remediate RLS/security. Do not commit unless separately requested by user.

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: final verification must consolidate build, lint, static audit, MCP state, and runtime evidence.
  - Skills: `supabase-postgres-best-practices` - to confirm no database-scope drift.
  - Omitted: `vercel-react-best-practices` - no new React implementation expected.

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: Final Verification | Blocked By: 1, 2, 3, 4, 5

  **References**:
  - Existing scripts: `package.json:6-11` - only `dev`, `build`, `build:dev`, `lint`, `preview` exist.
  - Routes for runtime smoke: `src/App.tsx:37-103`.
  - Accepted risk source: Supabase advisors from planning research reported RLS disabled and GraphQL exposure warnings; user selected demo-only accept risk.

  **Acceptance Criteria**:
  - [ ] `npm run lint` exits 0.
  - [ ] `npm run build` exits 0.
  - [ ] Final MCP check confirms no migrations or Edge Functions were added.
  - [ ] Final static search confirms no stale `users` Supabase table usage and no missing Edge Function invocation.
  - [ ] Final evidence documents accepted RLS/security risk without remediation.

  **QA Scenarios**:
  ```
  Scenario: Existing gates pass
    Tool: Bash
    Steps: Run npm run lint; run npm run build.
    Expected: Both commands exit 0.
    Evidence: .sisyphus/evidence/task-6-lint-build.txt

  Scenario: Scope guardrails were preserved
    Tool: Supabase MCP + Glob/Grep
    Steps: Check migrations list, Edge Function list, package.json scripts/dependencies, and source searches for stale users/function references.
    Expected: No migrations; no Edge Functions; no new test/typecheck/CI infrastructure; no stale references; accepted security advisories documented only.
    Evidence: .sisyphus/evidence/task-6-final-parity.md
  ```

  **Commit**: NO | Message: `n/a` | Files: `.sisyphus/evidence/task-6-final-parity.md`

## Final Verification Wave (MANDATORY — after ALL implementation tasks)
> 4 review agents run in PARALLEL. ALL must APPROVE. Present consolidated results to user and get explicit "okay" before completing.
> **Do NOT auto-proceed after verification. Wait for user's explicit approval before marking work complete.**
> **Never mark F1-F4 as checked before getting user's okay.** Rejection or user feedback -> fix -> re-run -> present again -> wait for okay.
- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ browser/Playwright if available)
- [ ] F4. Scope Fidelity Check — deep

## Commit Strategy
- Do not commit automatically. User has not requested a commit.
- If the user later requests a commit, use one commit after all verification passes.
- Suggested commit message if requested later: `fix(supabase): align API usage with live schema`

## Success Criteria
- Full API-schema parity with the live Supabase MCP state.
- Stale `users` and missing Edge Function assumptions removed.
- Generated types aligned to live schema.
- No database/schema/security/test/CI scope creep.
- `npm run lint` and `npm run build` pass.
- Final verification agents approve and user explicitly accepts the completed work.
