# Audit Phase 3 - Vendeur Yapalaan

Date : 2026-05-27

Statut : parcours vendeur local renforcé. Publication toujours bloquée.

## Fonctions ajoutées

- Création de compte vendeur locale avec téléphone et code OTP local.
- Profil boutique éditable : nom, commune, géolocalisation, WhatsApp et email.
- Sauvegarde locale du profil boutique dans l'état de l'application.
- Ajout de produit vendeur avec nom, catégorie, prix, stock et description courte.
- Modification locale du prix et du stock du produit sélectionné.
- Gestion de disponibilité : disponible, vendu ou masqué.
- Vue commandes vendeur avec nombre de commandes, produits et payout simulé.
- Rappel que les acheteurs peuvent commander sans compte.

## Décisions produit

- L'authentification reste locale et simulée jusqu'à l'activation Supabase.
- Les payouts restent simulés jusqu'à la phase paiement réel.
- Masquer un produit le retire des filtres acheteur sans le supprimer définitivement.
- Les commandes créées via checkout apparaissent dans l'espace vendeur lorsque le vendeur correspond à la boutique.

## Vérifications effectuées

- TypeScript : OK.
- Build local : OK.
- Les produits supportent maintenant l'état `hidden`.
- Le mapping Supabase sait traduire un produit non actif en produit masqué localement.

## Points reportés

- Vraie authentification OTP avec Supabase.
- Écriture réelle boutique/produits en base.
- Suppression définitive de produit.
- Payouts réels vendeur.
- Permissions vendeur/admin côté serveur.
