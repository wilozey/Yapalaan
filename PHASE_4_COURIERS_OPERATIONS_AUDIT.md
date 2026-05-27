# Audit Phase 4 - Livreurs et opérations Yapalaan

Date : 2026-05-27

Statut : opérations livraison validées en local. Publication toujours bloquée.

## Fonctions ajoutées

- Commission Yapalaan calculée par livraison.
- Commission visible au checkout pour chaque livreur.
- Commission enregistrée dans la commande locale.
- Commission visible dans le suivi de commande.
- Tableau opérationnel local dans les réglages.
- Modification locale du coût de livraison par livreur.
- Modification locale de la commission Yapalaan par livreur.
- Activation et désactivation locale d'un livreur.
- Retrait local d'un livreur.
- Ajout local d'un livreur de test.
- Statistiques locales : chiffre d'affaires livraison et commission estimée.

## Décisions produit

- Les acheteurs ne voient que les livreurs actifs.
- Un livreur inactif reste conservé côté opérations, mais disparaît du choix acheteur.
- La commission est incluse dans le coût de livraison affiché.
- La commission par défaut est de 12 % du coût de livraison, avec un minimum local de 300 FCFA.
- Les données restent locales jusqu'à l'activation Supabase.

## Vérifications effectuées

- TypeScript : OK.
- Build local : OK.
- Les livreurs supportent maintenant `availabilityStatus`.
- Les livreurs supportent maintenant `yapalaanCommissionFcfa`.
- Le schéma Supabase contient maintenant `yapalaan_commission_fcfa`.
- Le checkout utilise uniquement les livreurs actifs.

## Points reportés

- Gestion réelle des livreurs en base Supabase.
- Permissions admin.
- Historique réel des commissions par commande.
- Disponibilité temps réel des livreurs.
- Commission facturée et rapprochée avec paiement réel.
