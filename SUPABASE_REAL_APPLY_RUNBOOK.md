# Application réelle Supabase - Yapalaan

Date : 2026-05-27

Projet prévu : `https://hkihdjqnjqauivxujaji.supabase.co`

## Statut depuis cette session

Non appliqué à distance : Supabase CLI, `psql` et outil Supabase ne sont pas disponibles ici. Aucun secret Supabase n'a été fourni dans l'environnement local.

## Ordre exact dans le dashboard Supabase

1. Ouvrir Supabase Dashboard.
2. Aller dans SQL Editor.
3. Exécuter `supabase/yapalaan_schema.sql`.
4. Exécuter `supabase/yapalaan_seed.sql`.
5. Exécuter `supabase/yapalaan_rls_hardening.sql`.
6. Aller dans Project Settings > API.
7. Copier la clé `anon public`.
8. Créer `.env.local` localement avec :

```env
VITE_WARILO_DATA_MODE=supabase
VITE_SUPABASE_URL=https://hkihdjqnjqauivxujaji.supabase.co
VITE_SUPABASE_ANON_KEY=COLLER_LA_CLE_ANON_ICI
```

9. Redémarrer l'application locale.
10. Tester :
   - lecture produits ;
   - lecture livreurs ;
   - création commande ;
   - refus paiement test ;
   - suivi commande.

## Contrôles SQL rapides

```sql
select count(*) as sellers from public.warilo_seller_profiles;
select count(*) as products from public.warilo_products;
select count(*) as couriers from public.warilo_couriers;
select title, price_fcfa, stock, status from public.warilo_products order by created_at desc;
select full_name, delivery_fee_fcfa, yapalaan_commission_fcfa, status from public.warilo_couriers order by delivery_fee_fcfa asc;
```

## Point de sécurité

La clé `service_role` ne doit jamais être copiée dans `.env.local` frontend. Elle doit rester côté serveur uniquement.
