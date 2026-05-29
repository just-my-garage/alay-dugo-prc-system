# Task 1 donor relationship

- Exact foreign key: `donations_donor_id_fkey`
- Referenced relation: `donors`
- Downstream PostgREST nested select: `donations(*, donors!donations_donor_id_fkey(*))`
