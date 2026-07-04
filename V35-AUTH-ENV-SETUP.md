# V35 GR8 Passport Auth Environment Setup

Add these in Vercel → Project → Settings → Environment Variables.

Required before real users:

```txt
GR8_SESSION_SECRET=<long random secret>
GR8_ADMIN_KEY=<long private admin key>
```

Recommended when the SQL adapter is connected:

```txt
GR8_DATABASE_URL=<postgres connection string>
```

Optional external bridge still supported from V34:

```txt
GR8_BACKEND_ENDPOINT=<your own backend endpoint>
GR8_BACKEND_TOKEN=<private bridge token>
```

## Behaviour

Without `GR8_DATABASE_URL`, V35 uses signed HTTP-only cookies and temporary server memory fallback.
That is good enough to test the routes and forms, but accounts will not survive deployments or serverless restarts.

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
