# Mobile-First Responsive Overhaul - Learnings

## Gold Standard Pattern
- **Source**: `src/pages/blood-requests/index.tsx`
- **Pattern**: `flex-col sm:flex-row`, `w-full sm:w-auto`, responsive text sizing
- **Apply to**: All page headers, grids, and form layouts

## Tailwind Breakpoints (No Overrides)
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Key Responsive Utilities
- Page headers: `flex flex-col sm:flex-row sm:items-center gap-4`
- Grids: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Cards: `p-4 sm:p-6`
- Text: `text-xs sm:text-sm`, `text-lg sm:text-xl`
- Buttons: `w-full sm:w-auto`, `h-10`
- Modals: `w-[calc(100%-2rem)] sm:w-full sm:max-w-lg`

## Skills Loaded
- vercel-react-best-practices: All tasks
- supabase-postgres-best-practices: Tasks 5, 6, 7 (data-heavy portals)
- caveman: All tasks (communication efficiency)

## Execution Status
- Wave 1: 0/3 tasks
- Wave 2: 0/4 tasks
- Wave 3: Manual QA (user-driven)

## [2026-05-25] Portal Findings
### Home Portal
- Dashboard TabsList uses `grid grid-cols-5 w-full` → needs scroll/stack on mobile.
- Metrics grid `grid md:grid-cols-4` and drives `grid md:grid-cols-3` are mobile-first but could benefit from `sm:` intermediate steps.
- Inventory status uses `grid grid-cols-2` (always 2) → consider `grid-cols-1 sm:grid-cols-2`.
- CTA buttons in Home index use `flex gap-4 justify-center` (no mobile stack) → consider `flex-col sm:flex-row`.

### Donor Portal
- Donor list grid bug: `lg:grid grid-cols-2` should be `grid grid-cols-1 lg:grid-cols-2 gap-4`.
- Page header `flex items-center justify-between` should stack on mobile.
- Card padding `p-6` → `p-4 sm:p-6`.
- Form grids already `md:grid-cols-2`, but gaps large on mobile; buttons row should stack.

### Inventory Portal
- Blood type breakdown `grid grid-cols-3` should be responsive (`grid-cols-1 sm:grid-cols-3`).
- RecordNewUnit form grid `grid grid-cols-2` should be `grid-cols-1 md:grid-cols-2`.

### Blood Requests Portal
- ViewRequestDetails has `grid-cols-2/3` without responsive fallbacks.
- Create/Update request grids use `md:grid-cols-4` without `sm` fallback.
- Use `index.tsx` responsive patterns as reference.

## [2026-05-26] F1 Compliance Fixes
- Layout: removed global max width from Layout main; kept mobile-first padding via px-4 sm:px-6 md:px-8.
- Dashboard: replaced invalid Tailwind class `items-wrap` with `flex-wrap items-center` to allow wrapping without overflow.

## [2026-05-26] Mobile Button Width Fixes (Reapplied)
- CreateRequest/UpdateRequest/FulfillRequest: added w-full sm:w-auto to submit/cancel buttons in stacked rows.
- Donor header: Register New Donor button now w-full sm:w-auto for mobile stack.

## [2026-05-26] F2 Code Quality Review
- No invalid Tailwind utilities found in changed files; items-wrap already corrected to flex-wrap.
- No conflicting responsive utilities detected (base + sm/md/lg ordering consistent).
- No @media blocks introduced.

## [2026-05-26] F4 Scope Fidelity Check
- Reviewed git diff: changes are className/layout-only (no new logic, API calls, or state changes).
- No files outside UI/layout scope were touched.
