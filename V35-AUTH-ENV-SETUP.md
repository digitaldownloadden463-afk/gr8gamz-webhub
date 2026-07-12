# V35 GR8 Passport Auth Environment Setup

Add these in Vercel → Project → Settings → Environment Variables.

Required before real users:

```txt
GR8_SESSION_SECRET=<long random secret>
GR8_ADMIN_KEY=<long private admin key>
GR8_DATABASE_URL=<postgres connection string>
```

Apply both canonical schemas before enabling production traffic:

```txt
database/gr8-v34-database-core-schema.sql
database/v35-gr8-auth-accounts-schema.sql
```

If your PostgreSQL provider uses a private certificate authority, set `GR8_DATABASE_CA_CERT` to its PEM certificate. Publicly trusted providers do not need this override.

The external bridge is required for persistent support, report, Clubhouse and backend-sync submissions in production:

```txt
GR8_BACKEND_ENDPOINT=<your own backend endpoint>
GR8_BACKEND_TOKEN=<private bridge token>
```

## Behaviour

With `GR8_DATABASE_URL`, V35 stores password hashes, accounts and hashed session tokens in PostgreSQL. Without it, account registration is unavailable in production. Temporary memory fallback remains available in local development only; do not enable `GR8_ALLOW_EPHEMERAL_AUTH` or `GR8_ALLOW_EPHEMERAL_BACKEND` in production.

## New test routes

```txt
/auth
/admin/auth
/api/gr8/auth/status
/api/gr8/auth/register
/api/gr8/auth/login
/api/gr8/auth/me
/api/gr8/auth/sync
/api/gr8/auth/logout
/api/gr8/auth/admin/accounts
```
