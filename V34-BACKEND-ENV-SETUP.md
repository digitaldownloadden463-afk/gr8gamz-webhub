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

Without database variables, V34 APIs still work as contracts and use temporary in-memory storage per server instance. This is enough to test routes and payloads, but it is not persistent.

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
database/v34-gr8-backend-bridge-schema.sql
```
