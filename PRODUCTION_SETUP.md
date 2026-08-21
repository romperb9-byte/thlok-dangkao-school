# Production setup / ការរៀបចំប្រើប្រាស់ផ្លូវការ

The public GitHub Pages build remains demo-only until Supabase is connected.

## 1. Create Supabase

1. Create a Supabase account and a new project in the Singapore region.
2. Open SQL Editor and run `supabase/migrations/202608210001_initial_school_schema.sql`.
3. Copy only the Project URL and Publishable/anon key. Never commit the service-role key.

## 2. Configure GitHub Pages

Add these repository variables (not secrets) under Settings → Secrets and variables → Actions → Variables:

- `VITE_APP_MODE=production`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

The service-role key and Telegram bot token must only be stored as server-side secrets and must never use a `VITE_` prefix.

## 3. Production launch checklist

- Create the cluster-head account through Supabase Auth.
- Add one profile row per user and assign the minimum required role.
- Import verified school, teacher, class and student data.
- Test row-level security with every role.
- Enable database backups and audit retention.
- Complete a written data-access and incident-response policy.
- Obtain school authorization before adding real student information.


