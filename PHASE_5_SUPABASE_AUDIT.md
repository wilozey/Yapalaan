# Audit Phase 5 - Supabase Yapalaan

Date : 2026-05-27

Statut : Supabase applique reellement. Publication publique toujours bloquee.

## Valide

- `.env.example` contient l'URL du projet Supabase Yapalaan.
- `.env.local` active le mode Supabase pour le test local.
- Le mode `supabase` est cable dans la source de donnees.
- Le schema SQL contient les tables principales : vendeurs, produits, livreurs, commandes, lignes de commande et notes livreurs.
- Le seed SQL contient la boutique officielle Yapalaan, les 10 produits et les 12 livreurs temporaires.
- La creation de commande envoie la commission livraison a Supabase.
- Les politiques RLS finales du MVP sont appliquees.
- Les index de performance pour cles etrangeres sont appliques.
- Le checkout utilise une fonction Supabase controlee au lieu d'insertions directes dans les tables de commandes.
- Une commande test a ete creee via l'API publique puis supprimee.
- L'advisor securite Supabase signale que la fonction checkout publique est en `SECURITY DEFINER`.

## Migrations appliquees

- `20260527084015` - `yapalaan_schema_initial`
- `20260527084336` - `yapalaan_rls_hardening`
- `20260527085006` - `yapalaan_foreign_key_indexes`
- `20260527090806` - `yapalaan_frontend_grants`
- `20260527092026` - `yapalaan_checkout_rpc`
- `20260527092549` - `yapalaan_checkout_rpc_return_fix`

## Comptage verifie

- 1 vendeur officiel Yapalaan
- 10 produits actifs
- 12 livreurs actifs
- 0 commande initiale
- 0 note livreur initiale

## Fichiers Supabase

- `supabase/yapalaan_schema.sql`
- `supabase/yapalaan_seed.sql`
- `supabase/yapalaan_rls_hardening.sql`
- `supabase/yapalaan_foreign_key_indexes.sql`
- `supabase/yapalaan_frontend_grants.sql`
- `supabase/yapalaan_checkout_rpc.sql`
- `SUPABASE_PREPARATION.md`
- `SUPABASE_REAL_APPLY_RUNBOOK.md`

## Reste a tester avant live

- Parcours complet de commande depuis l'interface locale en mode Supabase.
- Verification visuelle que les produits et livreurs s'affichent depuis Supabase apres redemarrage local.
- Remplacer la fonction checkout publique par une API serveur ou Edge Function avant publication publique.
- Gestion vendeur reelle avec authentification.
- Paiement reel Mobile Money.
- Revue juridique humaine.
- Droits d'utilisation des images.
