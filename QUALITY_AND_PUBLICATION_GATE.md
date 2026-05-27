# Qualité et verrou de publication Yapalaan

## État actuel

- Application séparée du projet initial.
- Mode actif : démo locale.
- Publication : non autorisée à ce stade.
- URL locale : `http://127.0.0.1:5180/yapalaan`.
- Domaines acquis : `yapalaan.com`, `yapalaan.ci`.

## Fonctionnalités MVP présentes

- Catalogue produits Yapalaan.
- Images produits locales.
- Recherche produit.
- Filtre par catégorie.
- Filtre disponible / vendu.
- Détail produit adapté au type d'article.
- Prix estimé et économie affichés quand pertinent.
- Checkout avec choix du livreur et coût de livraison visible.
- Contact acheteur modifiable : téléphone, WhatsApp, email, géolocalisation, instructions.
- Création de commande en mode démo local.
- Suivi de commande après paiement démo.
- Notation du livreur en local.
- Espace vendeur avec compte requis simulé.
- Publication de produit vendeur en démo locale.
- Marquage produit disponible / vendu.
- Gestion locale des livreurs : ajouter, retirer, noter.
- Commission Yapalaan sur livraison en local.
- Paiement test réussi / refusé en simulation locale.
- Statuts de protection des fonds, litige et remboursement.
- Réglages couleur dans la page réglages.
- Français uniquement.

## Avant publication

- Brancher Supabase avec `.env.local`.
- Appliquer `supabase/yapalaan_schema.sql`.
- Remplacer les actions locales par les écritures Supabase nécessaires.
- Ajouter l'authentification vendeur réelle.
- Ajouter le paiement réel CinetPay ou autre prestataire choisi.
- Tester les parcours sur mobile réel.
- Vérifier les textes légaux : conditions, confidentialité, remboursements, litiges.
- Valider les droits d'utilisation des images produits.
- Faire une dernière revue sécurité avant mise en ligne.
- Faire une preview privée avant ouverture publique.
- Appliquer Supabase réel et vérifier les règles RLS.
- Configurer DNS et HTTPS sur les domaines acquis.

## Décision

Ne pas publier tant que tous les éléments de la section "Avant publication" ne sont pas validés.
