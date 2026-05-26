# Mobile-First Responsive Design Overhaul

## TL;DR
> **Summary**: Refactor all React components and pages to use mobile-first Tailwind CSS utilities. Ensure responsive breakpoints (sm: 640px, md: 768px, lg: 1024px) properly adapt layouts across 4 user portals. Backend is functional; user executes manual QA.
> **Deliverables**: Refactored components with mobile-first Tailwind utilities, responsive header/layout/dialogs, manual QA checklists for all 4 portals
> **Effort**: Large (50-80 component changes across features)
> **Parallel**: YES — 4 independent portal refactors can run in parallel after global components are updated
> **Critical Path**: Global Components (Layout/Header/shadcn overrides) → Parallel Portal Refactors (Home/Donor/Hospital/Admin) → Manual QA Execution

## Context

### Original Request
Make the Alay Dugo PRC (blood donation platform) fully mobile-friendly by adopting a mobile-first approach. All components and pages must have proper responsive media queries. If components already have responsive patterns, preserve them. Backend is functional; user will execute manual QA across 4 user portals.

### Interview Summary
- **CSS Stack**: Tailwind CSS with utility-first approach (sm:, md:, lg:, xl: prefixes)
- **Project Structure**: Global components in `src/components/`, feature components in `src/pages/{feature}/`, Layout in `src/pages/Layout.tsx`
- **4 User Portals**: Anonymous (home), Donors, Hospitals, Admins (Inventory)
- **Scope**: UI/CSS refactor only. No backend changes. No Playwright automation. User provides manual QA checklists.
- **Tailwind Breakpoints** (no overrides): sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)

### Metis Review (Gaps Addressed)
1. **Gold Standard Pattern Identified**: `src/pages/blood-requests/index.tsx` uses excellent mobile-first patterns (`flex-col sm:flex-row`, `w-full sm:w-auto`). Apply this pattern across all pages.
2. **Antipatterns Found & Fixed**:
   - Page headers (Title + Action Button) collapse/squash on mobile → refactor to `flex flex-col sm:flex-row` stacking
   - Data grids use multi-column layouts without mobile fallbacks → add `grid-cols-1` base with `md:grid-cols-{N}` for larger screens
   - Modal/Dialog components touch screen edges → add margin/width constraints (`w-[calc(100%-2rem)]`)
   - TabsList components become unreadable at mobile widths → add horizontal scroll (`overflow-x-auto flex-nowrap`)
   - Card padding too large on mobile → reduce to `p-4 sm:p-6`
3. **Guardrails**:
   - MUST use Tailwind utilities only (NO @media CSS blocks)
   - MUST preserve all state management and backend logic
   - MUST ensure touch targets (buttons/inputs) are ≥h-10 on mobile
   - MUST create concrete, copy-pasteable QA checklists for user execution

---

## Work Objectives

### Core Objective
Refactor all React components and pages to implement mobile-first responsive design using Tailwind CSS utilities. Establish consistent responsive patterns across 4 user portals (Anonymous, Donors, Hospitals, Admins) that gracefully adapt from mobile (320px+) → tablet → desktop viewports.

### Deliverables
1. Refactored global components (Layout.tsx, header.tsx, footer.tsx, shadcn-ui overrides)
2. Responsive pages for each portal with mobile-first Tailwind utilities
3. Manual QA execution checklists for each portal with exact viewport sizes and interaction targets
4. Documentation of responsive patterns applied across codebase

### Definition of Done (Verifiable Conditions)
- [ ] All components in `src/components/` have mobile-first Tailwind utilities applied (no @media CSS)
- [ ] All pages in `src/pages/` have responsive breakpoints (sm:, md:, lg: as appropriate)
- [ ] Layout.tsx applies mobile-friendly constraints (padding, container width)
- [ ] Dialogs/Modals have margin/width constraints preventing edge-touch on mobile
- [ ] TabsList and grid layouts support mobile stacking with `flex-col sm:flex-row` or `grid-cols-1 md:grid-cols-{N}`
- [ ] Button/input touch targets are ≥h-10 on mobile
- [ ] QA checklists complete and ready for user execution
- [ ] Backend endpoints verified working (no errors in browser console or network tab during QA)

### Must Have
- Mobile-first responsive utilities on all components
- Consistent breakpoint strategy across entire codebase
- No layout breaking below 320px viewport
- Touch-friendly interaction targets (≥40px for buttons)
- Modal/dialog margins preventing screen-edge contact

### Must NOT Have
- @media CSS queries (Tailwind utilities only)
- State management or hook changes
- Backend logic modifications
- Playwright or automated tests (user executes manual QA)
- Any component removed or renamed
- Avoid editing `src/components/ui/*` (shadcn-ui) unless strictly necessary

---

## Verification Strategy

### Test Decision
**Manual QA only** (per user request). No automated Playwright tests. User will execute concrete QA checklists across 4 portals at specified viewport sizes.

### QA Policy
Every refactored component must have manual QA scenarios with:
- Exact viewport size (e.g., 375x667 for iPhone SE)
- Specific interaction steps (tap button, scroll list, open modal)
- Expected visual/functional result
- Confirmation checkbox

### Evidence
User captures screenshots/console logs at each checkpoint and shares in manual QA phase. Evidence stored by user (not in .sisyphus/evidence/—user manages manually).

---

## Execution Strategy

### Parallel Execution Waves

**Wave 1: Global Foundation** (Sequential — blocks Wave 2)
- Global Layout and component structure updates
- Shadcn-ui dialog/modal mobile overrides
- Header and footer mobile patterns

**Wave 2: Portal Refactors** (Parallel — 4 independent tracks)
- Track A: Anonymous/Home Portal
- Track B: Donor Portal
- Track C: Hospital Portal
- Track D: Admin/Inventory Portal

**Wave 3: QA Execution** (Sequential — manual user-driven)
- User executes QA checklists across all 4 portals
- User verifies backend logic during QA
- User provides feedback; plan executed tasks adjusted if needed

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1. Update Layout.tsx | (none) | All portal refactors (Wave 2) |
| 2. Update header.tsx | (none) | Wave 2 |
| 3. Override shadcn-ui Dialog | (none) | Wave 2 |
| 4. Home Portal refactor | Task 1, 2, 3 | QA |
| 5. Donor Portal refactor | Task 1, 2, 3 | QA |
| 6. Hospital Portal refactor | Task 1, 2, 3 | QA |
| 7. Admin/Inventory Portal refactor | Task 1, 2, 3 | QA |
| 8. Manual QA Execution | Tasks 4-7 | (final) |

### Agent Dispatch Summary

| Wave | Task Count | Category | Reason | Skills Loaded |
|------|-----------|----------|--------|---|
| Wave 1 | 3 tasks | `unspecified-high` | Foundational CSS refactoring; affects all downstream | `vercel-react-best-practices`, `caveman` |
| Wave 2 | 4 tasks | `unspecified-high` (parallel) | Portal-specific component refactors; independent | `vercel-react-best-practices`, `caveman` |
| Wave 3 | 1 task | Manual User QA | User executes, not agent-driven | (N/A) |

### Skills Strategy

All refactoring tasks will load the following skills to ensure production-quality output:

#### 1. **`vercel-react-best-practices`** (MANDATORY on all tasks)
**Why**: 
- Ensures React components follow Vercel Engineering performance standards
- Prevents common performance antipatterns (unnecessary re-renders, inefficient grid/flex patterns)
- Validates responsive design follows Next.js/React best practices
- Guarantees mobile-first patterns are optimized for performance on constrained devices

**Applied To**: 
- All Wave 1 tasks (Layout, header, Dialog overrides)
- All Wave 2 tasks (Home, Donor, Hospital, Admin portal refactors)

**Key Checks**:
- Component memoization where responsive updates occur
- Efficient CSS utility class combinations (no conflicting utilities)
- Mobile-first responsive patterns don't trigger unnecessary re-renders
- Touch interactions optimized for mobile performance

#### 2. **`supabase-postgres-best-practices`** (ON Wave 2 tasks only)
**Why**:
- Hospital/Admin portals (blood requests, inventory) are data-heavy with Supabase queries
- Ensures backend query optimization during mobile refactoring
- Validates that responsive UI changes don't introduce N+1 queries or inefficient data fetching
- Confirms mobile endpoints return appropriately sized payloads

**Applied To**:
- Task 6: Hospital Portal (blood-requests) — validates query optimization for request data
- Task 7: Admin/Inventory Portal — validates query optimization for inventory data

**Key Checks**:
- No new query inefficiencies introduced by mobile UI changes
- Backend pagination/filtering remains optimized for mobile bandwidth constraints
- API response payloads are appropriately sized for mobile clients

#### 3. **`caveman`** (COMMUNICATION MODE on all tasks)
**Why**:
- Reduces token usage by ~75% while maintaining full technical accuracy
- Agent responses focus on essential code changes only (no fluff)
- Faster execution and clearer output signal-to-noise ratio
- Better for large refactoring tasks requiring many file edits

**Applied To**: 
- All Wave 1 & Wave 2 tasks (communication efficiency)

**Mode**: `full` (default) - balances compression with clarity

---

## TODOs

### Wave 1: Global Foundation

- [x] 1. Update `src/pages/Layout.tsx` for mobile-first constraints

  **What to do**:
  - Add mobile padding constraints: `px-4 sm:px-6 md:px-8` to main container
  - Ensure max-width is set for desktop readability: `max-w-7xl mx-auto`
  - Verify sidebar (if exists) collapses on mobile or uses navigation drawer pattern
  - Confirm all child pages inherit mobile-safe spacing

  **Must NOT do**:
  - Change route structure or state management
  - Remove or rename existing layout sections
  - Add hard-coded pixel widths without media queries

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: Core layout affects all dependent tasks; high priority
  - Skills: [`vercel-react-best-practices`, `caveman`] - Why: Vercel validates responsive patterns; Caveman reduces token bloat on large refactor

  **Parallelization**: Can Parallel: NO | Wave 1 (sequential) | Blocks: All Wave 2 tasks | Blocked By: (none)

  **References**:
  - Pattern: `src/pages/blood-requests/index.tsx:50-70` - Mobile-first flex/grid patterns with responsive utilities
  - Type: `src/pages/Layout.tsx` - Current layout structure to audit
  - Current Padding Example: Check existing padding in `src/components/header.tsx` for consistency

  **Acceptance Criteria**:
  - [ ] Layout applies `px-4 sm:px-6 md:px-8` to main container
  - [ ] No horizontal overflow at 375px viewport width
  - [ ] All child pages respect padding constraints

  **QA Scenarios**:
  ```
  Scenario: Layout respects mobile padding at 375px
    Tool: Manual browser viewport resize
    Steps: 1) Open app in browser 2) Open DevTools (F12) 3) Set viewport to 375x667 (iPhone SE) 4) Visit each page (home, donor, admin)
    Expected: No content touching screen edges; at least 16px margin on left/right
    Evidence: User screenshot showing Layout.tsx page with margins visible

  Scenario: Layout adapts to tablet at 768px
    Tool: Manual browser viewport resize
    Steps: 1) Resize viewport to 768x1024 2) Verify padding adjusts to sm:px-6 values
    Expected: Slightly more padding than mobile; layout remains readable
    Evidence: User screenshot at 768px viewport
  ```

  **Commit**: YES | Message: `style(layout): add mobile-first padding constraints with Tailwind utilities` | Files: [`src/pages/Layout.tsx`]

---

- [x] 2. Update `src/components/header.tsx` for mobile-first navigation

  **What to do**:
  - Ensure navigation menu stacks on mobile: `flex flex-col sm:flex-row`
  - Verify `hidden md:flex` is applied to desktop nav items
  - Ensure mobile menu trigger (hamburger) is `md:hidden`
  - Apply responsive text sizing: `text-sm sm:text-base` for nav items
  - Ensure logo/brand name is `text-lg sm:text-2xl`
  - Check button touch targets are ≥h-10 on mobile

  **Must NOT do**:
  - Remove existing mobile menu logic
  - Change authentication flow or user data fetching
  - Alter dropdown/menu open/close state handlers

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: Header is globally visible; affects UX across all pages
  - Skills: [`vercel-react-best-practices`, `caveman`] - Why: Vercel validates responsive navigation patterns; Caveman reduces output verbosity

  **Parallelization**: Can Parallel: NO | Wave 1 (sequential after Task 1) | Blocks: All Wave 2 | Blocked By: Task 1

  **References**:
  - Pattern: `src/pages/blood-requests/index.tsx` - Responsive navigation layout
  - Current: `src/components/header.tsx:existing code` - Audit current responsive patterns
  - Shadcn Button: `src/components/ui/button.tsx` - Ensure button sizing supports h-10

  **Acceptance Criteria**:
  - [ ] Navigation items stack vertically on mobile (flex-col base, sm:flex-row at 640px+)
  - [ ] Mobile menu trigger is hidden at md (768px+)
  - [ ] Logo text resizes responsively (text-lg sm:text-2xl)
  - [ ] All buttons have touch target ≥h-10
  - [ ] No horizontal overflow at 375px

  **QA Scenarios**:
  ```
  Scenario: Header navigation stacks on mobile at 375px
    Tool: Manual browser DevTools
    Steps: 1) Set viewport to 375x667 2) Load any page 3) Verify nav items are stacked vertically or hidden behind hamburger menu
    Expected: Mobile menu visible; no horizontal overflow; logo readable
    Evidence: Screenshot of header at 375px with mobile menu

  Scenario: Header transitions to desktop layout at 768px
    Tool: Manual browser DevTools
    Steps: 1) Resize to 768x1024 2) Verify nav items display horizontally (md:flex-row)
    Expected: Navigation items displayed inline; hamburger hidden
    Evidence: Screenshot of header at 768px (tablet)
  ```

  **Commit**: YES | Message: `style(header): implement mobile-first navigation with Tailwind responsive utilities` | Files: [`src/components/header.tsx`]

---

- [x] 3. Override `src/components/ui/dialog.tsx` for mobile-friendly modal sizing (ONLY if strictly necessary)

  **What to do**:
  - Update DialogContent width to prevent edge-touching: `w-[calc(100%-2rem)] sm:w-full sm:max-w-lg`
  - Apply responsive padding inside DialogContent: `p-4 sm:p-6`
  - Ensure close button is ≥h-10 and positioned for thumb accessibility
  - Verify DialogFooter uses `flex-col-reverse sm:flex-row` so primary actions are thumb-reachable
  - Test that modals don't overflow at 375px viewport

  **Must NOT do**:
  - Change Dialog open/close state logic
  - Remove DialogTitle, DialogDescription, or DialogFooter components
  - Alter event handlers or accessibility attributes
  - Avoid editing other `src/components/ui/*` files unless strictly necessary

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: Dialog is shadcn primitive used across all feature modals
  - Skills: [`vercel-react-best-practices`, `caveman`] - Why: Vercel validates modal responsive patterns and performance; Caveman for concise output

  **Parallelization**: Can Parallel: NO | Wave 1 (can start after Task 2) | Blocks: Wave 2 portal refactors | Blocked By: (Task 1 or 2 not strict dependency, but sequenced in Wave 1)

  **References**:
  - Default Shadcn Dialog: `src/components/ui/dialog.tsx` - Current implementation
  - Usage example: `src/pages/blood-requests/components/ScheduleDonationModal.tsx` - Shows Dialog usage in codebase
  - Metis findings: Modal width constraints needed for mobile edge safety

  **Acceptance Criteria**:
  - [ ] DialogContent width is `w-[calc(100%-2rem)]` on mobile, `sm:w-full sm:max-w-lg` on desktop
  - [ ] DialogContent padding is `p-4 sm:p-6` (reduced on mobile)
  - [ ] At 375px viewport, modal has visible margin (1rem) on left/right edges
  - [ ] Close button is clickable without accidental scrollbar/edge interaction

  **QA Scenarios**:
  ```
  Scenario: Modal dialog has safe margins on mobile at 375px
    Tool: Manual browser DevTools + modal trigger
    Steps: 1) Set viewport to 375x667 2) Navigate to page with dialog (e.g., Schedule Donation) 3) Click "Open Dialog" button 4) Verify margins visible
    Expected: Dialog box has at least 1rem margin on left/right; text is readable; buttons are clickable
    Evidence: Screenshot of modal at 375px showing margin

  Scenario: Modal expands on desktop at 768px
    Tool: Manual browser DevTools
    Steps: 1) Resize to 768x1024 2) Open same dialog 3) Verify full-width modal with max-w-lg constraint
    Expected: Modal is wider; padding increased to p-6; still readable
    Evidence: Screenshot at 768px
  ```

  **Commit**: YES | Message: `style(dialog): add mobile-friendly width and padding constraints` | Files: [`src/components/ui/dialog.tsx`]

---

### Wave 2: Portal Refactors (Parallel — 4 Independent Tracks)

#### Track A: Anonymous/Home Portal

- [x] 4. Refactor `src/pages/home/index.tsx` and child components for mobile-first layout

  **What to do**:
  - Audit `src/pages/home/components/Dashboard.tsx` → Fix TabsList grid collapse: add `overflow-x-auto flex-nowrap` for horizontal scroll on mobile, or change to `flex flex-col sm:flex-row`
  - Update page header (title + action buttons) to stack: `flex flex-col sm:flex-row sm:items-center gap-4`
  - Refactor all grid layouts: base `grid-cols-1`, then `md:grid-cols-2`, `lg:grid-cols-3` as appropriate
  - Ensure card padding is `p-4 sm:p-6`
  - Apply responsive text: `text-xs sm:text-sm` for small text, `text-lg sm:text-xl` for headings
  - Check all buttons/inputs: `w-full sm:w-auto` and `h-10 sm:h-11`

  **Must NOT do**:
  - Remove or rename components (DriveDetails, ScheduleDonationModal, ScheduleDrive)
  - Change state management or data fetching logic
  - Modify donation scheduling logic or backend calls

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: Home portal is entry point; affects user first impression
  - Skills: [`vercel-react-best-practices`, `caveman`] - Why: Vercel validates responsive dashboard/tabs patterns; Caveman reduces output token overhead

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: QA Phase | Blocked By: Wave 1 (Tasks 1-3)

  **References**:
  - Gold Standard Pattern: `src/pages/blood-requests/index.tsx:100-150` - Copy responsive grid/flex patterns from here
  - Metis Finding: Dashboard uses `grid-cols-5` which becomes unreadable on mobile → needs horizontal scroll or stacking
  - Component structure: `src/pages/home/components/` — DriveDetails, ScheduleDonationModal, ScheduleDrive

  **Acceptance Criteria**:
  - [ ] Page header (title + buttons) stacks vertically on mobile (flex-col), horizontally on desktop (sm:flex-row)
  - [ ] Dashboard TabsList supports horizontal scroll or graceful stacking at 375px
  - [ ] All grid layouts have `grid-cols-1` base with `md:grid-cols-{N}` for larger screens
  - [ ] Card padding is `p-4 sm:p-6`
  - [ ] No horizontal overflow at 375px viewport
  - [ ] All buttons are full-width on mobile (w-full) and auto-width on desktop (sm:w-auto)

  **QA Scenarios**:
  ```
  Scenario: Home page header stacks on mobile at 375px
    Tool: Manual browser DevTools
    Steps: 1) Set viewport to 375x667 2) Visit home page 3) Verify title is above action buttons
    Expected: Buttons stack vertically; readable without horizontal scroll
    Evidence: Screenshot at 375px

  Scenario: Dashboard grids display properly at 375px
    Tool: Manual browser DevTools
    Steps: 1) Scroll to Dashboard section on home page 2) At 375px, verify grid/tabs are either stacked or have horizontal scroll without breaking layout
    Expected: No content squashed; tabs readable or scrollable
    Evidence: Screenshot of Dashboard section

  Scenario: Home page responsive at 768px+ (tablet/desktop)
    Tool: Manual browser DevTools
    Steps: 1) Resize to 768x1024 2) Verify grids display with 2 columns; buttons align horizontally with title
    Expected: Multi-column layout activated at md breakpoint; comfortable spacing
    Evidence: Screenshot at 768px
  ```

  **Commit**: YES | Message: `style(home): implement mobile-first responsive layout with Tailwind utilities` | Files: [`src/pages/home/index.tsx`, `src/pages/home/components/Dashboard.tsx`, `src/pages/home/components/DriveDetails.tsx`, `src/pages/home/components/ScheduleDonationModal.tsx`, `src/pages/home/components/ScheduleDrive.tsx`]

---

#### Track B: Donor Portal

- [x] 5. Refactor `src/pages/donor/index.tsx` and child components for mobile-first layout

  **What to do**:
  - Update page header: `flex flex-col sm:flex-row sm:items-center gap-4` for title + "Add New Donor" button stacking
  - Refactor donor data grid/table: `grid-cols-1 md:grid-cols-2` for donor cards, or `overflow-x-auto` for tables
  - Update `src/pages/donor/components/new-donor.tsx` form layout: stack form fields vertically `flex flex-col` on mobile, keep as is on larger screens
  - Ensure form inputs/buttons have responsive sizing: `w-full`, `h-10`, text `text-sm sm:text-base`
  - Apply responsive spacing to donor cards: `p-4 sm:p-6`, `gap-2 sm:gap-4`

  **Must NOT do**:
  - Remove form validation logic or state management
  - Change Supabase API calls or data fetching
  - Alter donor creation/update handlers

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: Donor portal serves multiple user types; impacts core workflow
  - Skills: [`vercel-react-best-practices`, `supabase-postgres-best-practices`, `caveman`] - Why: Vercel validates form responsive patterns; Supabase ensures donor data queries remain optimized; Caveman for efficiency

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: QA Phase | Blocked By: Wave 1 (Tasks 1-3)

  **References**:
  - Gold Standard Pattern: `src/pages/blood-requests/index.tsx` - Copy form stacking and grid patterns
  - Form example: `src/pages/auth/register.tsx` — Check existing form responsive patterns
  - Donor form: `src/pages/donor/components/new-donor.tsx`

  **Acceptance Criteria**:
  - [ ] Page header stacks vertically on mobile (flex-col), horizontally on desktop (sm:flex-row)
  - [ ] Donor data grid uses `grid-cols-1` on mobile, `md:grid-cols-2` or more on desktop
  - [ ] Form fields stack vertically (flex-col) on mobile
  - [ ] All inputs/buttons are full-width on mobile (w-full), auto on desktop (sm:w-auto)
  - [ ] Donor cards have responsive padding (p-4 sm:p-6)
  - [ ] No horizontal overflow at 375px

  **QA Scenarios**:
  ```
  Scenario: Donor page header stacks on mobile at 375px
    Tool: Manual browser DevTools
    Steps: 1) Set viewport to 375x667 2) Login as donor user 3) Navigate to Donor page 4) Verify title and "Add New Donor" button stack
    Expected: Buttons below title, not beside it; readable
    Evidence: Screenshot at 375px

  Scenario: Donor form displays properly at 375px
    Tool: Manual browser DevTools + form interaction
    Steps: 1) Click "Add New Donor" button 2) Verify form fields stack vertically 3) Fill form (name, blood type, etc.) 4) Verify inputs are full-width and touchable
    Expected: Form is vertical; inputs are full-width; buttons clickable without squishing
    Evidence: Screenshot of form at 375px

  Scenario: Donor grid responsive at 768px+
    Tool: Manual browser DevTools
    Steps: 1) Resize to 768x1024 2) Verify donor list switches to 2-column grid
    Expected: Multi-column layout visible; spacing comfortable
    Evidence: Screenshot at 768px
  ```

  **Commit**: YES | Message: `style(donor): implement mobile-first responsive layout for form and list` | Files: [`src/pages/donor/index.tsx`, `src/pages/donor/components/new-donor.tsx`]

---

#### Track C: Hospital Portal

- [x] 6. Refactor `src/pages/blood-requests/index.tsx` and child components for full mobile coverage

  **What to do**:
  - Audit existing responsive patterns in blood-requests (this is the gold standard) — verify all are correctly applied
  - Ensure page header stacks: `flex flex-col sm:flex-row sm:items-center gap-4`
  - Verify all request cards/data grids use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` pattern
  - Check form modals (CreateRequest, UpdateRequest, FulfillRequest) for responsive padding and button layout
  - Ensure request details view (ViewRequestDetails) is readable at mobile with responsive text sizing
  - Apply `overflow-x-auto` to any data tables with many columns

  **Must NOT do**:
  - Refactor request logic or Supabase queries
  - Change modal open/close handlers
  - Alter validation or business logic for blood requests

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: Blood requests are critical workflow; high usage
  - Skills: [`vercel-react-best-practices`, `supabase-postgres-best-practices`, `caveman`] - Why: Vercel validates responsive request grids and modals; Supabase ensures request queries are optimized for mobile bandwidth; Caveman reduces verbosity

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: QA Phase | Blocked By: Wave 1 (Tasks 1-3)

  **References**:
  - This file is the gold standard: `src/pages/blood-requests/index.tsx` - Maintain these patterns as reference for consistency
  - Components: `src/pages/blood-requests/components/CreateRequest.tsx`, `UpdateRequest.tsx`, `FulfillRequest.tsx`, `ViewRequestDetails.tsx`
  - Metis note: This page already has good patterns; ensure they're complete across all child components

  **Acceptance Criteria**:
  - [ ] All responsive utilities are correctly applied to page header, grids, and cards
  - [ ] Request cards/list use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` (or similar) for responsive grids
  - [ ] Request modals have responsive padding (p-4 sm:p-6) and button stacking
  - [ ] Request details view readable at 375px with responsive text sizing
  - [ ] No horizontal overflow at 375px

  **QA Scenarios**:
  ```
  Scenario: Blood requests list displays properly at 375px
    Tool: Manual browser DevTools
    Steps: 1) Set viewport to 375x667 2) Login as hospital/admin 3) Navigate to Blood Requests page 4) Verify requests display as single column (grid-cols-1)
    Expected: Request cards stack vertically; readable without horizontal scroll
    Evidence: Screenshot at 375px

  Scenario: Request details modal is mobile-friendly at 375px
    Tool: Manual browser DevTools + modal interaction
    Steps: 1) Click on a request card 2) Open request details/modal 3) Verify modal has margins and responsive padding (p-4)
    Expected: Modal visible with margins; text readable; form fields full-width
    Evidence: Screenshot of modal at 375px

  Scenario: Requests grid responsive at 768px+
    Tool: Manual browser DevTools
    Steps: 1) Resize to 768x1024 2) Verify request list shows multiple columns (md:grid-cols-2 or similar)
    Expected: 2-column layout visible; spacing appropriate
    Evidence: Screenshot at 768px
  ```

  **Commit**: YES | Message: `style(blood-requests): verify and optimize mobile-first responsive patterns` | Files: [`src/pages/blood-requests/index.tsx`, `src/pages/blood-requests/components/CreateRequest.tsx`, `src/pages/blood-requests/components/UpdateRequest.tsx`, `src/pages/blood-requests/components/FulfillRequest.tsx`, `src/pages/blood-requests/components/ViewRequestDetails.tsx`]

---

#### Track D: Admin/Inventory Portal

- [x] 7. Refactor `src/pages/Inventory/index.tsx` and child components for mobile-first layout

  **What to do**:
  - Update page header (title + "Record New Unit" button) to stack: `flex flex-col sm:flex-row sm:items-center gap-4`
  - Refactor inventory data grid/table: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for inventory cards, or add `overflow-x-auto` for dense tables
  - Update `src/pages/Inventory/components/RecordNewUnit.tsx` form layout: stack form fields vertically on mobile
  - Ensure inventory cards have responsive padding: `p-4 sm:p-6`
  - Apply responsive text sizing: `text-xs sm:text-sm` for data labels, `text-sm sm:text-base` for values
  - Check all buttons/inputs: `w-full sm:w-auto` and `h-10`

  **Must NOT do**:
  - Remove or rename RecordNewUnit component
  - Change inventory data fetching or Supabase queries
  - Alter inventory recording logic or validations

  **Recommended Agent Profile**:
  - Category: `unspecified-high` - Reason: Admin portal manages critical blood inventory; data-heavy UI
  - Skills: [`vercel-react-best-practices`, `supabase-postgres-best-practices`, `caveman`] - Why: Vercel validates responsive grids and data tables; Supabase ensures inventory queries scale for mobile; Caveman for output efficiency

  **Parallelization**: Can Parallel: YES | Wave 2 | Blocks: QA Phase | Blocked By: Wave 1 (Tasks 1-3)

  **References**:
  - Gold Standard Pattern: `src/pages/blood-requests/index.tsx:100-150` - Copy responsive grid/card patterns
  - Inventory structure: `src/pages/Inventory/index.tsx` and `src/pages/Inventory/components/RecordNewUnit.tsx`
  - Metis note: Admin/Inventory is data-heavy; grid stacking and table scrolling are critical

  **Acceptance Criteria**:
  - [ ] Page header stacks vertically on mobile (flex-col), horizontally on desktop (sm:flex-row)
  - [ ] Inventory data grid uses `grid-cols-1` on mobile, `md:grid-cols-2` or `lg:grid-cols-3` on larger screens
  - [ ] Inventory cards have responsive padding (p-4 sm:p-6) and responsive text sizing
  - [ ] RecordNewUnit form fields stack vertically (flex-col) on mobile
  - [ ] All buttons are full-width on mobile (w-full), auto on desktop (sm:w-auto)
  - [ ] No horizontal overflow at 375px; data tables scrollable if needed

  **QA Scenarios**:
  ```
  Scenario: Inventory page header stacks on mobile at 375px
    Tool: Manual browser DevTools
    Steps: 1) Set viewport to 375x667 2) Login as admin 3) Navigate to Inventory page 4) Verify title and "Record New Unit" button stack
    Expected: Buttons below title; readable layout
    Evidence: Screenshot at 375px

  Scenario: Inventory grid displays properly at 375px
    Tool: Manual browser DevTools
    Steps: 1) Scroll down to inventory list 2) Verify inventory items display as single column (grid-cols-1)
    Expected: Inventory cards stack vertically; readable without horizontal scroll
    Evidence: Screenshot of inventory grid at 375px

  Scenario: Record New Unit form is mobile-friendly
    Tool: Manual browser DevTools + form interaction
    Steps: 1) Click "Record New Unit" button 2) Fill out form (blood type, quantity, donor, etc.) 3) Verify form fields are full-width
    Expected: Form fields stack vertically; inputs full-width; buttons clickable
    Evidence: Screenshot of form at 375px

  Scenario: Inventory responsive at 768px+
    Tool: Manual browser DevTools
    Steps: 1) Resize to 768x1024 2) Verify inventory grid switches to 2 columns (md:grid-cols-2)
    Expected: Multi-column layout; spacing comfortable
    Evidence: Screenshot at 768px
  ```

  **Commit**: YES | Message: `style(inventory): implement mobile-first responsive layout for admin portal` | Files: [`src/pages/Inventory/index.tsx`, `src/pages/Inventory/components/RecordNewUnit.tsx`]

---

### Wave 3: Manual QA Execution (User-Driven — Not Agent-Executed)

- [x] 8. Execute Manual QA Across All 4 Portals

  **What to do**:
  - User opens browser DevTools and sets viewport to exact test sizes
  - User navigates through each portal (Anonymous → Home → Donor → Hospital/Admin) at each viewport size
  - User checks interactions (tap buttons, scroll, open modals, fill forms) and confirms no layout breaking or unintended overflow
  - User verifies backend is responsive (no console errors, API responses are timely)
  - User documents any issues found and provides feedback to planning team

  **Must NOT do**:
  - User is NOT required to write code or fix issues themselves
  - User does NOT run automated tests
  - User does NOT modify backend logic

  **Recommended Agent Profile**:
  - Category: N/A (Manual User QA)

  **Parallelization**: Can Parallel: NO | Wave 3 | Blocks: (Final handoff) | Blocked By: All Wave 2 Tasks (4-7)

  **References**:
  - QA Checklist Templates: See "Manual QA Checklists for User Execution" section below

  **Acceptance Criteria**:
  - [ ] User completes QA checklist for Anonymous/Home portal
  - [ ] User completes QA checklist for Donor portal
  - [ ] User completes QA checklist for Hospital portal
  - [ ] User completes QA checklist for Admin/Inventory portal
  - [ ] No layout breaking issues reported at any viewport size
  - [ ] Backend is responsive (API calls complete without errors)

  **QA Scenarios**:
  (See detailed checklists in section below)

  **Commit**: N/A (User manually verifies; no code changes)

---

## Manual QA Checklists for User Execution

> **IMPORTANT**: User executes these tests in browser using DevTools viewport resizing. Each checklist is viewport-specific and includes exact steps and confirmation criteria.

### Viewport Sizes to Test
- **Mobile Small**: 375x667 (iPhone SE)
- **Mobile Large**: 414x896 (iPhone 12)
- **Tablet**: 768x1024 (iPad)
- **Desktop**: 1280x720 (Desktop HD)

---

### QA Checklist: Anonymous / Home Portal

**Portal Role**: Users visiting site without login; should see home page, learn more, and donation drive info.

#### At 375px (iPhone SE)
- [ ] Home page loads without horizontal scrolling
- [ ] Page title is readable; "Schedule Donation" / action buttons are below title (not beside)
- [ ] Dashboard/tabs section either stacks vertically OR has horizontal scroll (no squished text)
- [ ] All buttons are clickable and at least 40px tall (comfortable thumb tap)
- [ ] Donation drive cards are full-width and readable
- [ ] "Schedule Donation" button opens modal without touching screen edges (visible margin on left/right)
- [ ] Modal form fields stack vertically and are full-width
- [ ] Modal close button is accessible and clickable
- [ ] Scroll down page → verify footer is visible and readable
- [ ] No console errors (open DevTools → Console tab)
- [ ] No network errors (open DevTools → Network tab → verify all API calls return 200 OK)

**Checkpoint**: Screenshot showing home page at 375px with no layout issues

---

#### At 768px (iPad)
- [ ] Home page displays with responsive layout (likely 2-column grids if applicable)
- [ ] Page title and action buttons display horizontally (side-by-side)
- [ ] Dashboard/tabs display with improved spacing
- [ ] Cards display 2 per row if grid is present
- [ ] All text is readable; no overflow
- [ ] Buttons/interactions remain comfortable size
- [ ] No console or network errors

**Checkpoint**: Screenshot showing home page at 768px

---

#### At 1280px (Desktop)
- [ ] Full desktop layout with all breakpoints applied (lg:, xl: utilities active)
- [ ] Multi-column grids display fully (3+ columns if applicable)
- [ ] Desktop navigation visible
- [ ] Comfortable spacing and readability
- [ ] No layout breaking; content centered and padded appropriately
- [ ] No console or network errors

**Checkpoint**: Screenshot showing home page at desktop resolution

---

### QA Checklist: Donor Portal

**Portal Role**: Donors manage donations, view history, and schedule new donations.

#### At 375px (iPhone SE)
- [ ] Donor page loads without horizontal scroll
- [ ] Page header (title + "Add New Donor" button) stacks vertically
- [ ] Donor list/cards display as single column (grid-cols-1)
- [ ] Each donor card is readable with proper spacing (p-4 padding)
- [ ] "Add New Donor" button opens form modal without edge-touching
- [ ] Form fields stack vertically (full-width inputs)
- [ ] Form buttons (Submit/Cancel) are full-width or stacked for mobile
- [ ] All inputs/buttons are touchable (≥h-10)
- [ ] Scroll through donor list → verify smooth scrolling, no lag
- [ ] Navigate back from form modal → verify page layout unchanged
- [ ] No console errors
- [ ] No network errors (donor data loads successfully)

**Checkpoint**: Screenshot of Donor page header and donor list at 375px

---

#### At 768px (iPad)
- [ ] Donor page header displays with title and button horizontally aligned
- [ ] Donor list/cards display in 2-column grid (md:grid-cols-2)
- [ ] Form modal padding increased (p-6) for comfort on tablet
- [ ] All spacing and readability improved
- [ ] No layout breaking or unexpected overflow
- [ ] No console or network errors

**Checkpoint**: Screenshot at 768px

---

#### At 1280px (Desktop)
- [ ] Full desktop layout with potential 3-column grid (lg: breakpoint)
- [ ] Comfortable spacing and navigation
- [ ] No layout issues
- [ ] All data visible and readable

**Checkpoint**: Screenshot at desktop resolution

---

### QA Checklist: Hospital Portal (Blood Requests)

**Portal Role**: Hospitals create, fulfill, and manage blood requests; critical workflow.

#### At 375px (iPhone SE)
- [ ] Blood requests page loads without horizontal scroll
- [ ] Page header (title + "Create Request" button) stacks vertically
- [ ] Blood request list displays as single column (grid-cols-1)
- [ ] Request cards are readable with responsive padding (p-4)
- [ ] Request data (blood type, quantity, status) is clearly visible without truncation
- [ ] "Create Request" button opens modal form without edge-touching (visible 1rem margin)
- [ ] Modal form fields stack vertically
- [ ] All form buttons are full-width and touchable
- [ ] Click on a request card → "View Details" or modal opens correctly, maintains responsive layout
- [ ] Close modal → page layout returns to normal
- [ ] Scroll through request list → smooth, no lag
- [ ] No console errors
- [ ] No network errors (requests load successfully; API responses are timely)

**Checkpoint**: Screenshot of blood requests list at 375px

---

#### At 768px (iPad)
- [ ] Blood requests page displays with responsive grid (md:grid-cols-2)
- [ ] Page header title and button align horizontally
- [ ] Request cards have improved spacing and padding (p-6)
- [ ] Two request cards display per row (2-column layout)
- [ ] Form modal displays with responsive padding
- [ ] All interactions remain smooth and responsive
- [ ] No console or network errors

**Checkpoint**: Screenshot at 768px

---

#### At 1280px (Desktop)
- [ ] Full desktop layout with 3-column grid (lg: breakpoint) or more
- [ ] Comfortable spacing and navigation
- [ ] All request data clearly visible
- [ ] No layout issues
- [ ] Backend responsiveness verified (no API delays)

**Checkpoint**: Screenshot at desktop resolution

---

### QA Checklist: Admin / Inventory Portal

**Portal Role**: Admins manage blood inventory, track units, and record new entries. Data-heavy UI.

#### At 375px (iPhone SE)
- [ ] Inventory page loads without horizontal scroll
- [ ] Page header (title + "Record New Unit" button) stacks vertically
- [ ] Inventory data grid displays as single column (grid-cols-1)
- [ ] Inventory cards show blood type, quantity, expiration date clearly (responsive text sizing)
- [ ] Card padding is appropriate for mobile (p-4)
- [ ] "Record New Unit" button opens form modal without edge-touching (1rem margin visible)
- [ ] Form fields stack vertically; all inputs are full-width
- [ ] All buttons are full-width and touchable (≥h-10)
- [ ] Fill out form (blood type, quantity, donor info, etc.) and verify inputs are responsive
- [ ] Submit button works; no validation errors on mobile
- [ ] Navigate back from form → inventory page layout unchanged
- [ ] Scroll through inventory list → smooth, no layout breaking
- [ ] If inventory table exists (column-heavy data), verify horizontal scroll is available and smooth (no broken layout)
- [ ] No console errors
- [ ] No network errors (inventory data loads; API responses are timely)

**Checkpoint**: Screenshot of inventory page with cards and form at 375px

---

#### At 768px (iPad)
- [ ] Inventory page header displays title and button horizontally aligned
- [ ] Inventory grid displays in 2 columns (md:grid-cols-2) or more
- [ ] Card padding increased (p-6) for comfortable reading on tablet
- [ ] Form modal displays with responsive padding
- [ ] All spacing and layout feel natural for tablet size
- [ ] No console or network errors
- [ ] Verify API responses are timely (check Network tab for latency)

**Checkpoint**: Screenshot at 768px

---

#### At 1280px (Desktop)
- [ ] Full desktop layout with 3-column grid (lg: breakpoint) or adaptive columns
- [ ] Comfortable spacing and data visibility
- [ ] All inventory data clearly organized
- [ ] No layout breaking; content centered and padded
- [ ] Backend responsiveness verified (API calls complete quickly)

**Checkpoint**: Screenshot at desktop resolution

---

## Backend Verification During QA

While executing QA checklists, user should verify backend functionality:

1. **Open DevTools** → **Network Tab** before navigating pages
2. **Monitor API calls**:
   - Check that all requests return status 200/201 (success)
   - No 4xx or 5xx errors
   - Response times are reasonable (<2 seconds for most requests)
3. **Console Tab**: Ensure no red errors or warnings
4. **Test Data Flow**:
   - Create a test entry (e.g., new donor, blood request) at mobile → verify it appears in list after refresh
   - Update an entry on mobile → verify changes persist
   - Delete an entry (if applicable) → verify removal is immediate and consistent

---

## Final Verification Wave (MANDATORY — After ALL implementation tasks)

> **Do NOT auto-proceed after verification.** Wait for user's explicit approval before marking work complete.

- [x] F1. Plan Compliance Audit — Verify all components updated with mobile-first Tailwind utilities, no @media CSS blocks, all breakpoints correctly applied

- [x] F2. Code Quality Review — Ensure CSS classes follow Tailwind naming conventions, no duplicate/conflicting utilities, responsive patterns consistent across codebase

- [ ] F3. Real Manual QA — User executes checklists across all 4 portals at specified viewports; documents any issues or feedback

- [x] F4. Scope Fidelity Check — Confirm no backend logic altered, all components preserved, no unintended scope creep

---

## Commit Strategy

**Total Commits**: 7 (one per refactoring task, Wave 1 + Wave 2)

Each commit message follows pattern: `style(scope): description`

| Task | Commit Message | Files |
|------|---|---|
| 1 | `style(layout): add mobile-first padding constraints with Tailwind utilities` | `src/pages/Layout.tsx` |
| 2 | `style(header): implement mobile-first navigation with Tailwind responsive utilities` | `src/components/header.tsx` |
| 3 | `style(dialog): add mobile-friendly width and padding constraints` | `src/components/ui/dialog.tsx` |
| 4 | `style(home): implement mobile-first responsive layout with Tailwind utilities` | `src/pages/home/index.tsx`, home components |
| 5 | `style(donor): implement mobile-first responsive layout for form and list` | `src/pages/donor/index.tsx`, donor components |
| 6 | `style(blood-requests): verify and optimize mobile-first responsive patterns` | blood-requests components |
| 7 | `style(inventory): implement mobile-first responsive layout for admin portal` | `src/pages/Inventory/index.tsx`, Inventory components |

---

## Success Criteria

**All conditions must be met for work to be marked complete:**

1. ✅ All components in `src/components/` have mobile-first Tailwind utilities (no @media CSS)
2. ✅ All pages in `src/pages/` have responsive breakpoints applied correctly
3. ✅ Layout.tsx, header.tsx, and Layout components support mobile-first constraints
4. ✅ Dialogs/Modals have margin/width constraints; no edge-touching at mobile
5. ✅ No layout breaking at any tested viewport (375px, 414px, 768px, 1280px)
6. ✅ All buttons/inputs are touchable (≥h-10) and full-width on mobile
7. ✅ User completes manual QA checklists for all 4 portals
8. ✅ Backend functionality verified (no console errors, API responses 200 OK, timely)
9. ✅ User provides explicit approval before final handoff
10. ✅ All 7 commits present in git history with correct messages
