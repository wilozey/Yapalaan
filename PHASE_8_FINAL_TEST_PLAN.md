# Plan de tests finaux Yapalaan

Date : 2026-05-27

Statut : plan prêt, tests réels finaux à exécuter avant publication.

## Tests à exécuter

- Mobile réel Android : accueil, boutique, produit, checkout, suivi, réglages.
- Mobile réel iPhone si disponible : mêmes parcours.
- Desktop : lisibilité et absence de débordements.
- Checkout complet : paiement test réussi et paiement test refusé.
- Vendeur : compte local, sauvegarde boutique, ajout produit, modification, vendu, masqué.
- Livreurs : coût, commission, actif/inactif, ajout, retrait, notation.
- Supabase : lecture produits, lecture livreurs, création commande, RLS.
- Build production : `npm.cmd run build`.
- Revue UI finale : logo, textes français, images, navigation basse.

## Critères de sortie

- Aucun texte anglais dans l'interface.
- Aucun bouton principal cassé.
- Aucun produit sans image.
- Aucun paiement réel en mode test.
- Aucune publication avant validation du propriétaire.
