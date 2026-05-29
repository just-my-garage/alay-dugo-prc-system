# Learnings

- Regenerated Supabase types to PostgREST 14.5; `donations.donor_id` now references `donors` via `donations_donor_id_fkey`.
- Donor rows expose `isAdmin` in Row/Insert/Update, so downstream code can rely on the generated type instead of a custom shim.
- Use explicit nested select syntax `donors!donations_donor_id_fkey(*)` when expanding donor data from a donation row.
- Auth profile now loads from `donors` with `maybeSingle()`, so a missing donor row cleanly sets `userProfile` to `null` and stops loading.
- Admin gating and donor drive details now consume `isAdmin`; scoped searches confirmed no active `is_admin` or `.from("users")` matches remain in the target paths.
- [2026-05-29] Donor page hook now queries `public.donors` for both count and paginated fetches, keeps the existing search fields, and uses a `donors` query key so cache identity matches the table.
- Dashboard home hook active donor count now queries `public.donors` and preserves `eligibility_status = "Eligible"`; no stale `users` table call remains in `src/pages/home/home.hook.tsx`.
- [2026-05-29] Drive details and inventory donation lookups now use the explicit FK relation `donors!donations_donor_id_fkey(...)`; `RecordNewUnit` renders `donation.donors` and no nested `donation.users` remained in the target files.
- [2026-05-29] `src/pages/Profile.tsx` now loads and saves donor records from `public.donors` using the signed-in email lowercased, relies on `.maybeSingle()` for lookup, and renders a dedicated missing-profile state instead of hanging on loading.
- [2026-05-29] Task 7 sweep migrated the remaining active app-code `userProfile?.is_admin` checks in `ScheduleDonationModal`, dashboard, and blood-request screens to `userProfile?.isAdmin`; app-code-only sweep excluding generated Supabase types now reports no stale references.
- [2026-05-29] Raw exact stale-reference sweep still reports `is_admin` only inside the generated legacy `users` table shape in `src/integrations/supabase/types.ts`; the active `donors` type exposes `isAdmin` and app code no longer consumes the stale field.
- [2026-05-29] Production build passes after the final migration sweep; output is captured in `.sisyphus/evidence/task-7-build.txt`.
