# Rapport d'application Supabase - Yapalaan

Date : 2026-05-27

## Projet

- Nom : Yapalaan
- Project ref : `hkihdjqnjqauivxujaji`
- Region : `eu-north-1`
- Etat : actif et sain

## Actions realisees

- Schema applique dans Supabase.
- Donnees initiales inserees.
- RLS appliquee et durcie.
- Index de performance ajoutes.
- Mode Supabase active localement via `.env.local`.
- Fonction checkout securisee ajoutee.
- Test d'ecriture commande effectue via l'API publique, puis nettoye.

## Donnees chargees

- 1 boutique officielle Yapalaan.
- 10 produits fournis par l'equipe Yapalaan.
- 12 livreurs temporaires Abidjan.

## Verification Supabase

- Securite : RLS active, avec un avertissement advisor sur la fonction checkout publique en `SECURITY DEFINER`.
- Performance : les alertes de cles etrangeres sans index sont resolues.
- Ecriture : le checkout public fonctionne via RPC, sans donner au frontend un droit direct d'administration des commandes.
- Remarque : les nouveaux index peuvent apparaitre comme non utilises jusqu'aux premiers vrais parcours clients.

## Decision

Supabase est maintenant applique reellement. Le projet peut passer aux tests complets en mode Supabase, mais il ne doit pas encore etre publie publiquement tant que le checkout n'est pas deplace vers une API serveur ou Edge Function.
