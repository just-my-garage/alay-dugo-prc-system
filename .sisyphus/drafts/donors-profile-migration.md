# Draft: Donors Profile Migration

## Requirements (confirmed)
- Update `src/pages/Profile.tsx` because the system currently uses `public.users` and now uses `public.donors`.
- Update other related functions in the system that still depend on `public.users`.

## Technical Decisions
- Pending: exact `public.donors` lookup key and columns to use will be based on schema exploration, not assumed.
- Pending: scope of "related functions" will be defined as all active app code paths referencing `public.users` or user profile shape sourced from that table.

## Research Findings
- User-provided `src/pages/Profile.tsx` currently fetches and updates `.from("users")` by lowercased session email.
- Exploration running for users references, donor schema, and test/build coverage.

## Open Questions
- Confirm whether implementation should include database/generated type updates if local Supabase types still reference `users`.
- Confirm test strategy after test infrastructure findings return.

## Scope Boundaries
- INCLUDE: profile fetch/update and related app functions still targeting `public.users`.
- INCLUDE: verification plan for build/lint and agent-executed smoke checks.
- EXCLUDE: direct code edits in this planning phase.
