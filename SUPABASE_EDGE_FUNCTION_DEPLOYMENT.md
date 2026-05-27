# Deploiement Edge Function checkout - Yapalaan

Date : 2026-05-27

Fonction : `create-checkout-order`

## Objectif

Remplacer le checkout RPC SQL public par une fonction serveur Supabase avant publication.

## Variables a configurer dans Supabase

Dans Supabase Dashboard > Edge Functions > Secrets :

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

La cle `SUPABASE_SERVICE_ROLE_KEY` doit rester uniquement cote Supabase Edge Function. Elle ne doit jamais etre mise dans le frontend, GitHub ou Vercel.

## Deploiement CLI

Depuis le dossier du projet :

```powershell
supabase functions deploy create-checkout-order --project-ref hkihdjqnjqauivxujaji
```

URL attendue :

```text
https://hkihdjqnjqauivxujaji.supabase.co/functions/v1/create-checkout-order
```

## Variable frontend apres deploiement

Ajouter dans l'environnement frontend :

```env
VITE_YAPALAAN_CHECKOUT_API_URL=https://hkihdjqnjqauivxujaji.supabase.co/functions/v1/create-checkout-order
```

## Validation obligatoire

1. Redemarrer l'application.
2. Creer une commande depuis l'interface.
3. Verifier que la commande est creee dans Supabase.
4. Verifier que le montant est recalcule cote serveur.
5. Supprimer les commandes de test.
6. Retirer l'acces public au RPC SQL `create_yapalaan_checkout_order`.

## Pourquoi c'est important

Le frontend ne doit pas pouvoir ecrire librement les montants de commande. La fonction serveur doit recalculer le prix produit, la livraison et la commission Yapalaan directement depuis Supabase.
