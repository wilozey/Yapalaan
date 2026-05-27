# Domaines et lancement live - Yapalaan

Date : 2026-05-27

Domaines acquis :

- `yapalaan.com`
- `yapalaan.ci`

## Recommandation

Utiliser `yapalaan.com` comme domaine principal international et rediriger `yapalaan.ci` vers `yapalaan.com`, ou inversement si la stratégie locale Côte d'Ivoire est prioritaire.

Choix recommandé pour le MVP :

- Principal : `https://yapalaan.com`
- Redirection : `https://www.yapalaan.com` vers `https://yapalaan.com`
- Redirection : `https://yapalaan.ci` vers `https://yapalaan.com`
- Redirection : `https://www.yapalaan.ci` vers `https://yapalaan.com`

## DNS à configurer après choix hébergeur

Sur l'hébergeur final, récupérer :

- CNAME pour `www`.
- A record ou CNAME apex selon l'hébergeur.
- Configuration HTTPS automatique.

## Variables production

```env
VITE_WARILO_DATA_MODE=supabase
VITE_SUPABASE_URL=https://hkihdjqnjqauivxujaji.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_APP_PRIMARY_DOMAIN=https://yapalaan.com
VITE_APP_SECONDARY_DOMAIN=https://yapalaan.ci
```

## Avant ouverture publique

1. Déployer une preview privée.
2. Tester avec Supabase réel.
3. Tester commandes sans paiement réel.
4. Tester paiement réel en mode sandbox.
5. Faire revue juridique.
6. Faire revue sécurité.
7. Tester sur téléphone Android réel.
8. Tester sur iPhone réel si disponible.
9. Configurer redirections DNS.
10. Ouvrir progressivement.
