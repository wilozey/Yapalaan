# Blocages avant live public - Yapalaan

Date : 2026-05-27

## Bloquants techniques

- Test complet de l'app locale en mode Supabase a finaliser.
- Fonction checkout publique `SECURITY DEFINER` a remplacer par API serveur/Edge Function avant live.
- Authentification vendeur reelle a finaliser.
- Paiement reel non branche.
- Backend paiement securise absent.
- Webhooks paiement absents.
- Gestion admin production a securiser.

## Bloquants juridiques

- Revue juridique humaine obligatoire.
- Declaration/autorisation donnees personnelles a confirmer.
- Droits d'utilisation des images produits a confirmer.
- Conditions, confidentialite, remboursements et litiges a finaliser.

## Bloquants operationnels

- Support WhatsApp officiel a confirmer.
- Process validation vendeur a confirmer.
- Process gestion litige a confirmer.
- Process livreurs/commission a confirmer.
- Contrats ou accords livreurs a clarifier avant commission reelle.

## Deja fait

- Supabase reel applique.
- Donnees initiales chargees.
- RLS appliquee.
- RLS appliquee avec avertissement Supabase documente sur le checkout public.
- Index de performance ajoutes.
- Checkout Supabase teste via API publique et nettoye.

## Decision

Yapalaan peut continuer la phase finale de preparation live, mais ne doit pas etre ouvert publiquement avant resolution des points ci-dessus.
