# Migrate App Profile Data from `public.users` to `public.donors`

## TODOs

- [x] 1. Regenerate Supabase types and discover donor relationship
- [x] 2. Migrate auth profile contract and admin consumers to `isAdmin`
- [x] 3. Migrate `Profile.tsx` fetch/update to `public.donors`
- [x] 4. Migrate donor admin data hook to `public.donors`
- [x] 5. Migrate dashboard active donor count to `public.donors`
- [x] 6. Migrate donation donor relation joins in drive details and inventory
- [x] 7. Run migration sweep, build/lint, and integrated smoke QA

## Final Verification Wave

- [ ] F1. Plan Compliance Audit — oracle
- [ ] F2. Code Quality Review — unspecified-high
- [ ] F3. Real Manual QA — unspecified-high (+ playwright if UI)
- [ ] F4. Scope Fidelity Check — deep
