
# GR8 GAMZ V34 — Database Core + Persistent Platform API

V34 prepares GR8 GAMZ for real cross-device platform data while keeping the player/community product layer in-house.

## Included

- PostgreSQL-ready database core
- Safe fallback mode when no database URL is configured
- `/admin/database` Control Room status page
- `/api/gr8/database/status` health check
- Passport sync API
- Game activity event API
- Clubhouse post persistence API
- Support message persistence API
- Report persistence API
- Admin queue API foundation with optional admin token
- V34 unified SQL schema
- Client best-effort background sync from current local Passport/Clubhouse flows

## Environment variables

Use either:

```txt
DATABASE_URL=postgresql://...
```

or:

```txt
GR8_DATABASE_URL=postgresql://...
```

Optional later:

```txt
GR8_ADMIN_API_TOKEN=long-random-secret
```

## Safety

The site does not break if the database is not connected. Existing GR8 Passport, My Arcade, Clubhouse and Control Room workflows continue in local browser storage until the database is ready.
