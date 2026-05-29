# Task 7 browser smoke QA

Status: BLOCKED before browser navigation.

Attempted setup:
- Started Vite dev server with `npm run dev -- --host 127.0.0.1 --port 5173`; Vite selected `http://127.0.0.1:5175/` because ports 5173 and 5174 were already in use. Raw log: `.sisyphus/evidence/task-7-dev-server.log`.
- Invoked Playwright MCP `browser_navigate` for `http://127.0.0.1:5173/`.

Blocker:
- Playwright MCP failed during browser initialization with: `Chromium distribution 'chrome' is not found at /opt/google/chrome/chrome`; it instructed `Run "npx playwright install chrome"`.
- `npx playwright install chrome` failed because installing Chrome requires sudo, and this environment cannot provide an interactive sudo password. Raw log: `.sisyphus/evidence/task-7-playwright-install.txt`.
- `npx playwright install chromium` downloaded the fallback Chromium build, but the MCP still requires the Chrome distribution at `/opt/google/chrome/chrome`. Raw log: `.sisyphus/evidence/task-7-playwright-chromium-install.txt`.

Credential note:
- Authenticated donor/admin smoke flows were not attempted after the browser runtime blocker.
- No test donor/admin credentials were provided in the task context; `.env.example` only documents Supabase URL/key variables, not login fixtures.

QA scenarios not claimed as passed:
- `/profile` donor profile save
- admin navigation/gating
- `/donors` donor list
- donation drive details donor labels
- `/inventory` donor labels/dropdowns
