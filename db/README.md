The uploaded `database.sql` remains the original MySQL schema reference. Its eight tables are represented in `db/schema.ts` for Netlify Database (Postgres). The upload contained no records, so the new database starts empty. No default accounts or passwords are created.

Netlify provisions the database and applies the migrations in `netlify/database/migrations` during deployment. Do not apply migrations manually. Generate future schema changes with `npx drizzle-kit generate --name describe_change`.

Server-side TypeScript code can import `db` from `db/index.ts` and the table definitions from `db/schema.ts`. Netlify supplies the connection automatically. Keep this client on the server.

The conversion preserves column names, nullability, defaults, decimal precision, enum values, unique constraints, indexes and cascading foreign keys. Unsigned MySQL identifiers use Postgres bigint identities, binary columns use bytea, and LONGTEXT uses text. A database trigger preserves automatic updated_at changes for users and cranes. PostgreSQL text comparison uses its database collation rather than MySQL's utf8mb4_unicode_ci; case-insensitive lookup behavior needs explicit handling when migrating application queries.

The existing Express server still uses mysql2 and MySQL-specific queries. It has not been migrated to this database. Connecting the existing screens requires a separate application migration, including its authentication and API routes.
