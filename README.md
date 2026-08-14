# Super Admin — ProManage

Standalone platform admin for ProManage (PG owner). Manages property verification, owners, tenants, payments, and complaints.

## Setup

```bash
pnpm install
cp .env.example .env
# fill Supabase keys + SUPER_ADMIN_EMAILS
pnpm dev
```

Runs on [http://localhost:3001](http://localhost:3001).

## Auth

Allowlisted emails in `SUPER_ADMIN_EMAILS` are elevated to role `super_admin` on sign-in (same Supabase project as the owner app).
