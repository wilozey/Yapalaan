# Yapalaan

Yapalaan est une marketplace mobile-first pour acheter et vendre localement avec vendeurs vérifiés, paiement protégé, choix du livreur et suivi de commande.

## Lancer en local

```powershell
npm.cmd install
npm.cmd run dev
```

Ouvrir `http://127.0.0.1:5180/yapalaan`.

## Vérifier le projet

```powershell
npm.cmd run check
npm.cmd run build
```

## Supabase

Le mode par défaut reste `local-demo`.

Pour activer Supabase :

1. Exécuter `supabase/yapalaan_schema.sql`.
2. Exécuter `supabase/yapalaan_seed.sql`.
3. Exécuter `supabase/yapalaan_rls_hardening.sql`.
4. Copier `.env.example` vers `.env.local`.
5. Renseigner `VITE_SUPABASE_ANON_KEY`.
6. Mettre `VITE_WARILO_DATA_MODE=supabase`.
7. Redémarrer l'app.

Ne jamais mettre la clé `service_role` dans le frontend.

## Domaines

- `yapalaan.com`
- `yapalaan.ci`

La publication reste bloquée tant que Supabase réel, paiement réel, sécurité, juridique et tests mobiles réels ne sont pas validés.
