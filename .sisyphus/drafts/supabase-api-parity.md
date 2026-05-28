# Draft: Supabase API Parity Verification

## Requirements (confirmed)
- "Make sure the supabase API implementation is working properly and is 1 to 1 with the system. You have supabase MCP. Check it out"

## Technical Decisions
- Use Supabase MCP as the database source of truth for live schema, migrations, edge functions, and security advisories.
- Treat this as a planning request: produce an execution plan for verifying and fixing API/schema parity, not direct code changes.
- Scope selected by user: parity only; do not include RLS/security remediation as implementation work.
- RLS handling selected by user: demo-only accept risk; document RLS disabled and exposure warnings as risks, but do not plan policy implementation.
- Verification selected by user: use existing gates only; do not include adding test framework, test scripts, CI, or typecheck script.

## Research Findings
- Supabase MCP: public schema has 11 tables: blood_product_types, blood_request_items, blood_requests, blood_units, donation_drives, donations, donors, hospitals, prc_centers, shipment_items, shipments.
- Supabase MCP: no recorded migrations and no edge functions.
- Supabase security advisor: RLS is disabled on all 11 public tables; anon/authenticated GraphQL exposure warnings exist for all public tables; update_updated_at_column has mutable search_path warning.
- Test infrastructure assessment rerun: confirmed build and lint scripts exist; no test runner config, no test/spec files, no typecheck/test scripts, no Supabase tests/mocks, no CI workflow detected.

## Open Questions
- Define whether "1 to 1 with the system" means frontend feature coverage, TypeScript types matching DB schema, CRUD operation coverage, or all of these.

## Scope Boundaries
- INCLUDE: Supabase API implementation parity verification, schema/type/API mapping, runtime checks, security advisory handling plan.
- EXCLUDE: Direct implementation edits during planning; RLS/security remediation implementation.
