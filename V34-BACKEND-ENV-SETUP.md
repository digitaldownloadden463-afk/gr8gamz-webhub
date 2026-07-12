# GR8 GAMZ V34 Backend Environment Setup

V34 adds the API bridge and schema for the in-house backend. It does not force a third-party account, forum or chat product.

## Vercel environment variables

Add these in Vercel when the database/external backend is ready:

```txt
GR8_ADMIN_KEY=choose-a-long-private-admin-key
GR8_DATABASE_URL=postgres-connection-string
```

Optional external bridge variables:

```txt
GR8_BACKEND_ENDPOINT=https://your-private-backend.example.com/gr8/write
GR8_BACKEND_TOKEN=private-shared-token
```

## Current behaviour

Without database variables, public submission APIs use a bounded temporary-memory fallback per server instance. Account persistence is not considered production-ready until the canonical database schemas are applied. Admin APIs always fail closed unless `GR8_ADMIN_KEY` is configured.

## Main routes

```txt
/api/gr8/backend/status
/api/gr8/backend/sync
/api/gr8/backend/player
/api/gr8/backend/clubhouse
/api/gr8/backend/support
/api/gr8/backend/report
/api/gr8/backend/admin/queue
/backend
/admin/backend
```

## SQL

Use this schema when provisioning the database:

```txt
database/gr8-v34-database-core-schema.sql
database/v35-gr8-auth-accounts-schema.sql
```

The older `database/v34-gr8-backend-bridge-schema.sql` filename is retained only for compatibility and mirrors the canonical V34 core schema. Do not mix independently versioned table definitions.
