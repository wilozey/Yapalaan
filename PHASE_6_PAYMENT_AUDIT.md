# Audit Phase 6 - Paiement Yapalaan

Date : 2026-05-27

Statut : paiement préparé en simulation locale. Paiement réel non activé.

## Préparé dans l'application

- Choix du moyen de paiement : Wave CI, Orange Money, MTN MoMo, livraison contre remboursement.
- Simulation locale de paiement réussi.
- Simulation locale de paiement refusé.
- Blocage de création de commande si le paiement test est refusé.
- Statut de protection des fonds dans le suivi.
- Statut de litige dans le suivi.
- Statut de remboursement dans le suivi.
- Commission livraison conservée avec la commande.

## Décision paiement

Le prestataire final reste à confirmer. CinetPay reste l'option recommandée pour Mobile Money en Côte d'Ivoire, mais aucune clé ni transaction réelle ne doit être ajoutée avant la fin des tests Supabase et sécurité.

## À faire avant production

- Créer le compte marchand du prestataire choisi.
- Obtenir les clés de test.
- Créer un backend sécurisé pour initier les paiements.
- Ne jamais exposer les clés secrètes dans le frontend.
- Ajouter webhooks de paiement réussi, échoué et remboursé.
- Tester Wave, Orange Money, MTN MoMo et Moov Money si disponible.
- Relier libération des fonds à la confirmation de livraison.
