# Audit Phase 5 - Supabase Yapalaan

Date : 2026-05-27

Statut : intégration Supabase préparée localement. Publication toujours bloquée.

## Préparé dans le projet

- `.env.example` contient l'URL du projet Supabase Yapalaan.
- Le mode par défaut reste `local-demo`.
- Le mode `supabase` est déjà câblé dans la source de données.
- Le schéma SQL contient les tables principales : vendeurs, produits, livreurs, commandes, lignes de commande et notes livreurs.
- Le schéma SQL contient les champs ajoutés pendant les phases 2 à 4.
- Un seed SQL a été ajouté avec la boutique officielle Yapalaan, les 10 produits et les livreurs temporaires.
- La création de commande envoie maintenant la commission livraison à Supabase.
- Le guide Supabase indique l'ordre d'exécution : schéma, seed, variables, redémarrage.

## Fichiers Supabase

- `supabase/yapalaan_schema.sql`
- `supabase/yapalaan_seed.sql`
- `SUPABASE_PREPARATION.md`
- `.env.example`

## Tests locaux effectués

- TypeScript : OK.
- Build local : OK.
- Mode local-demo conservé.
- L'application répond toujours localement.

## À faire dans le dashboard Supabase

1. Exécuter `supabase/yapalaan_schema.sql`.
2. Exécuter `supabase/yapalaan_seed.sql`.
3. Récupérer la clé anon publique.
4. Créer `.env.local` avec `VITE_WARILO_DATA_MODE=supabase`.
5. Redémarrer l'app locale.
6. Tester la lecture produits.
7. Tester la lecture livreurs.
8. Tester la création commande.

## Non fait volontairement

- Le schéma n'a pas été appliqué à distance depuis cette session.
- La clé anon Supabase n'a pas été ajoutée.
- Les tests réels Supabase n'ont pas été exécutés.
- Les règles RLS finales doivent encore être revues avant publication.
