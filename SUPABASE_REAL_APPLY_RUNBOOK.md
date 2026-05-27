# Application reelle Supabase - Yapalaan

Date : 2026-05-27

Projet Supabase : `hkihdjqnjqauivxujaji`
URL : `https://hkihdjqnjqauivxujaji.supabase.co`
Statut : applique reellement sur Supabase.

## Ce qui a ete applique

1. Schema initial : `yapalaan_schema_initial`
2. Donnees de depart : boutique officielle Yapalaan, 10 produits, 12 livreurs temporaires Abidjan
3. Durcissement RLS : `yapalaan_rls_hardening`
4. Index de performance : `yapalaan_foreign_key_indexes`
5. Permissions frontend limitees : `yapalaan_frontend_grants`
6. Fonction checkout securisee : `yapalaan_checkout_rpc`
7. Correction retour fonction checkout : `yapalaan_checkout_rpc_return_fix`
8. Mode local Supabase active dans `.env.local`

## Donnees verifiees

- Vendeurs : 1
- Produits : 10
- Livreurs : 12
- Commandes : 0
- Notes livreurs : 0

## Securite verifiee

- Advisor securite Supabase : avertissement sur la fonction checkout publique en `SECURITY DEFINER`.
- RLS active sur les tables publiques principales.
- Lecture publique limitee aux vendeurs verifies, produits actifs et livreurs actifs.
- Creation publique limitee aux commandes, lignes de commande et notes livreurs necessaires au MVP.
- Les commandes passent par une fonction Supabase controlee qui recalcule le prix produit + livraison cote base.
- Cette fonction doit etre remplacee par une API serveur ou Edge Function avant publication publique.
- La cle `service_role` ne doit jamais etre utilisee dans le frontend.

## Performance verifiee

Les index de cles etrangeres ont ete ajoutes pour :

- produits par vendeur ;
- commandes par vendeur ;
- commandes par livreur ;
- lignes de commande par commande ;
- lignes de commande par produit ;
- notes livreurs par livreur ;
- notes livreurs par commande.

Supabase peut signaler ces index comme "unused" tant que le projet n'a pas encore de trafic reel. C'est normal apres une migration recente.

## Pour tester localement en mode Supabase

Le fichier `.env.local` contient :

```env
VITE_WARILO_DATA_MODE=supabase
VITE_SUPABASE_URL=https://hkihdjqnjqauivxujaji.supabase.co
VITE_SUPABASE_ANON_KEY=cle_publique_supabase
```

Ensuite :

1. Redemarrer l'application locale.
2. Ouvrir `http://127.0.0.1:5180/yapalaan`.
3. Tester la lecture catalogue.
4. Tester le choix livreur.
5. Tester une commande.
6. Verifier la commande dans Supabase.
7. Supprimer toute commande de test avant un jeu de donnees public propre.

## Avant publication publique

Supabase est applique, mais le live public reste bloque tant que les paiements reels, la revue juridique finale, les droits images et les tests de bout en bout ne sont pas valides.
