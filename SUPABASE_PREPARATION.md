# Preparation Supabase Yapalaan

Projet Supabase : `https://hkihdjqnjqauivxujaji.supabase.co`

Le projet peut fonctionner en deux modes :

- `local-demo` : donnees locales, utile pour travailler sans connexion Supabase.
- `supabase` : donnees lues et ecrites dans le projet Supabase reel.

## Etat actuel

Supabase est applique reellement depuis le 2026-05-27.

## Ordre des fichiers SQL

1. `supabase/yapalaan_schema.sql`
2. `supabase/yapalaan_seed.sql`
3. `supabase/yapalaan_rls_hardening.sql`
4. `supabase/yapalaan_foreign_key_indexes.sql`
5. `supabase/yapalaan_frontend_grants.sql`
6. `supabase/yapalaan_checkout_rpc.sql`

## Activation locale Supabase

1. Verifier que `.env.local` existe.
2. Verifier que `VITE_WARILO_DATA_MODE=supabase`.
3. Redemarrer le serveur local.
4. Tester lecture catalogue, choix livreur et creation commande.

## Garde-fous

- Ne jamais utiliser la cle `service_role` dans le frontend.
- Garder `.env.local` hors GitHub.
- Ne pas publier tant que les paiements reels et la revue juridique ne sont pas valides.
- Revenir a `VITE_WARILO_DATA_MODE=local-demo` si Supabase doit etre coupe temporairement.
