# Navigation Seed

`navigation.sql` contains preset navigation data exported from the configured PostgreSQL database.

It includes:
- 1 demo owner user: `demo-navigation-user`
- active rows from `nav_category`
- live rows from `nav_item`

Import:

```bash
psql "$DATABASE_URL" -f db/navigation.sql
```

Re-export from the current configured database:

```bash
DATABASE_PROVIDER=postgresql DATABASE_URL="your_database_url" npm run db:export-navigation-seed
```
