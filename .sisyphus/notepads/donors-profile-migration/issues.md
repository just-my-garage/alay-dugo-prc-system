# Issues

- [2026-05-29] Reverted unrelated mobile-first and home-page edits from this task; keeping only donor types, evidence, and donors-profile notes in scope.
- [2026-05-29] LSP diagnostics briefly reported stale `users`-relation errors after `DriveDetails` changed to `donors!donations_donor_id_fkey`; a rebuild/refresh cleared the false positives.

- [2026-05-29] Reverted the stray register success-nav edit; scope creep was removed and register.tsx returned to the intended pre-task UI.

- [2026-05-29] Removed the stray register-hook edit and linked migration file; both were scope creep and are now reverted.
- [2026-05-29] LSP diagnostics for `DriveDetails.tsx` still report pre-existing TypeScript hints (`Link`, `scheduleDonation`, `cancelDonation` unused); no errors were introduced by the donor join migration.
- [2026-05-29] Task 7 full lint remains blocked by pre-existing unrelated ESLint debt. Raw output in `.sisyphus/evidence/task-7-lint.txt` includes existing `RecordNewUnit.tsx` explicit-any errors, `home.hook.tsx` explicit-any errors, `auth.context.tsx` fast-refresh warning, plus broader unrelated UI/request typing warnings/errors outside the migration cleanup scope.
- [2026-05-29] Browser smoke QA is blocked in this environment: Playwright MCP requires Chrome at `/opt/google/chrome/chrome`, `npx playwright install chrome` requires interactive sudo, and no donor/admin test login fixtures were provided. Evidence is recorded in `.sisyphus/evidence/task-7-browser-qa.md` and `.sisyphus/evidence/task-7-playwright-install.txt`.
