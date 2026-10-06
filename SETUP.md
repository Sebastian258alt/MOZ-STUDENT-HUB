# MOZ STUDENT HUB V2: setup

Without Supabase the site still works with the local DEMO data (accounts, favourites, orders and saved quiz results stay off).

## 1. Create the Supabase project
supabase.com > New project. Save the database password.

## 2. Create tables, security and demo data
Supabase > SQL Editor > run, in order: `supabase/migrations/001_schema.sql`, then `002_seed.sql`.
Tables: profiles, institutions, categories, products, orders, favorites, quizzes, questions, quiz_attempts, user_progress. RLS is enabled on all of them.

## 3. Keys
Supabase > Project Settings > API. Copy the **Project URL** and the **anon/publishable key** into `js/config.js`.
Never use the `service_role` key in this project. It must not be in the browser or in Git.

## 4. Authentication
Supabase > Authentication > URL Configuration: set **Site URL** to your site and add **Redirect URLs**: `http://localhost:3000/**` and `https://YOUR-SITE.vercel.app/**`.
Email/password works by default (users confirm by email; you can turn confirmation off while testing).

## 5. Google login
1. Google Cloud Console > APIs & Services > Credentials > Create OAuth client ID (Web application).
2. Authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`.
3. Supabase > Authentication > Providers > Google: paste Client ID and Secret, enable.

## 6. Run locally
Google login needs http, not file://. In this folder: `python3 -m http.server 3000` then open http://localhost:3000.

## 7. Deploy to Vercel
Push the folder to GitHub, Vercel > Add New > Project > import it. Framework: Other. No build command, output directory `.`. Add your Vercel URL to the Supabase Redirect URLs (step 4).

## Environment variables
This is a static site with no build step, so Vercel env vars are not injected into the browser. `js/config.js` holds only public values, which are safe by design because RLS protects the data. Real env vars will make sense in V3 with a build step or serverless functions.

## Make yourself admin
Sign in once, then in the SQL Editor: `update profiles set role='admin' where email='YOUR@EMAIL';`
Confirm an order: `update orders set status='confirmed' where id='ORDER_ID';`
Add products in Table Editor (keep `demo` true until the file is real).
