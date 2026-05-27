# Etape 1 - Coeur produit Yapalaan

Date : 2026-05-27

Objectif : rendre le coeur produit assez solide pour soutenir la confiance, les paiements, les vendeurs et la livraison avant marketing massif.

## 1. Checkout securise

- [x] Ajouter une Edge Function `create-checkout-order`.
- [x] Faire recalculer prix produit, frais de livraison et commission cote serveur.
- [x] Brancher le frontend sur `VITE_YAPALAAN_CHECKOUT_API_URL`.
- [ ] Deployer l'Edge Function dans Supabase.
- [ ] Tester une commande depuis l'interface locale en mode Supabase.
- [ ] Supprimer ou bloquer le RPC SQL public apres validation.

## 2. Comptes vendeurs

- [ ] Activer authentification vendeur par telephone/OTP.
- [ ] Lier chaque boutique a un utilisateur Supabase Auth.
- [ ] Limiter modification produits/boutique au proprietaire.
- [ ] Ajouter verification vendeur admin.

## 3. Acheteurs sans friction

- [x] Garder l'achat sans compte obligatoire.
- [ ] Proposer creation de compte apres checkout.
- [ ] Permettre a l'acheteur de retrouver une commande par telephone + code.

## 4. Commandes et suivi

- [x] Commande demo locale.
- [ ] Commande Supabase visible dans un tableau de bord.
- [ ] Statuts : paiement en attente, paye, accepte, en livraison, livre, litige.
- [ ] Notifications WhatsApp ou email apres changement de statut.

## 5. Livraison

- [x] Livreurs temporaires Abidjan.
- [x] Cout livraison par livreur.
- [x] Commission Yapalaan par livraison.
- [ ] Contrat/process livreur avant commission reelle.
- [ ] Historique des notes livreurs.

## 6. Paiement

- [ ] Choisir prestataire final.
- [ ] Connecter paiement test Mobile Money.
- [ ] Ajouter webhooks paiement cote serveur.
- [ ] Bloquer la validation vendeur tant que paiement non confirme.
- [ ] Preparer logique escrow MVP.

## Suggestion prioritaire

Ne pas lancer de grande campagne marketing tant que le checkout serveur, l'auth vendeur et le paiement test ne sont pas valides. Le marketing doit amplifier la confiance, pas exposer un parcours encore fragile.
