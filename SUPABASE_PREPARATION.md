# Préparation Supabase Yapalaan

Projet Supabase prévu : `https://hkihdjqnjqauivxujaji.supabase.co`

Le projet reste en mode démo local tant que `VITE_WARILO_DATA_MODE=local-demo`.

## Activation locale Supabase

1. Ouvrir le dashboard Supabase du projet.
2. Exécuter `supabase/yapalaan_schema.sql` dans SQL Editor.
3. Exécuter `supabase/yapalaan_seed.sql` dans SQL Editor.
4. Copier `.env.example` vers `.env.local`.
5. Renseigner `VITE_SUPABASE_ANON_KEY`.
6. Mettre `VITE_WARILO_DATA_MODE=supabase`.
7. Redémarrer le serveur local.
8. Tester lecture catalogue, choix livreur et création commande.

## Garde-fous

- Ne pas utiliser la clé service role dans le frontend.
- Ne pas publier tant que les politiques RLS finales ne sont pas revues.
- Ne pas activer paiement réel pendant cette phase.
- Revenir à `VITE_WARILO_DATA_MODE=local-demo` si Supabase n'est pas prêt.
