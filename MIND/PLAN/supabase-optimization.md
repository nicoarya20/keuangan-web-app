# Plan: Optimize Supabase Connection for Faster DB Push

This plan focuses on improving the speed and reliability of the Prisma `db push` command by optimizing the connection settings.

## Analysis
- The current `DATABASE_URL` uses port `6543` (Supabase Connection Pooler/PgBouncer) with `?pgbouncer=true`.
- Connection poolers are excellent for production traffic but can add latency and overhead for DDL (Data Definition Language) operations like `npx prisma db push`.
- The `DIRECT_URL` uses port `5432`, which connects directly to the PostgreSQL instance.

## Optimization Strategy
1.  **Switch to Direct Connection:** Use the direct database URL (port 5432) for `DATABASE_URL` during development and synchronization tasks. This bypasses the pooling layer entirely.
2.  **Add Connection Timeout:** Append `connect_timeout=300` to ensure the connection doesn't drop prematurely during intensive operations.
3.  **Clean Cache:** Ensure Prisma generated files are fresh.

## Implementation Steps
1.  Update `.env` to point `DATABASE_URL` to the direct connection string.
2.  Keep `DIRECT_URL` identical for consistency in the Prisma schema.
3.  Run `npx prisma db push`.
4.  Regenerate Prisma Client.

## Verification
- Measure the time taken for `npx prisma db push`.
- Confirm successful synchronization.
