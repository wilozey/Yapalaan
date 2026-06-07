# Strategie Yapalaan Import - Chine

Source : document `YAPALAAN_China_Import_MVP_Strategy V2 update.docx`

Date d'integration : 2026-06-07

## Vision

Transformer Yapalaan en passerelle de commerce de confiance entre les acheteurs africains, les vendeurs locaux et les fournisseurs mondiaux, en commencant par la Chine.

## Mission

Acheter localement, vendre localement, importer mondialement, payer de facon securisee, recevoir sans risque et construire la confiance par verification et protection paiement.

## Nouveau module : Yapalaan Import

Section dediee permettant aux clients de trouver, estimer et acheter des produits venant de Chine avec l'assistance Yapalaan.

## MVP prioritaire

La fonctionnalite la plus forte pour commencer est :

> Coller un lien produit Chine et obtenir un prix final en FCFA.

Pourquoi :

- peu couteux a construire ;
- genere des revenus rapidement ;
- ne demande pas de stock initial ;
- cree une difference forte face aux marketplaces locales ;
- transforme Yapalaan en assistant d'achat international.

## Fonctionnalites MVP

### 1. Coller un lien produit Chine

Sources visees :

- Alibaba ;
- 1688 ;
- AliExpress ;
- Temu ;
- DHGate ;
- Made-in-China.

Yapalaan doit :

- detecter la source ;
- extraire ou demander le nom produit ;
- traduire la description ;
- estimer transport, douane, frais Yapalaan ;
- afficher un prix final FCFA ;
- proposer "Acheter pour moi".

### 2. Calculateur import IA

Ventilation du prix :

- cout produit ;
- transport international ;
- douane estimee ;
- frais Yapalaan ;
- total livre estime.

### 3. Traduction IA

Traduction des descriptions chinoises vers :

- francais ;
- anglais plus tard si utile pour fournisseurs.

### 4. Acheter pour moi

Yapalaan agit comme agent d'achat :

- confirmation du devis ;
- paiement protege ;
- achat fournisseur ;
- suivi expedition ;
- livraison locale.

### 5. Recherche par image

L'utilisateur envoie une photo produit. Yapalaan recherche des produits similaires sur les marketplaces chinoises.

### 6. Demande produit

L'utilisateur decrit un produit. Yapalaan aide a trouver fournisseurs, prix et options de livraison.

### 7. Commandes groupees

Regrouper plusieurs commandes pour reduire :

- transport ;
- frais de douane ;
- cout final client.

### 8. Badges fournisseurs verifies

Niveaux recommandes :

- Bronze ;
- Argent ;
- Or ;
- Platine.

### 9. Assistant WhatsApp Import

Les clients pourront envoyer :

- lien produit ;
- image ;
- demande texte.

Yapalaan repondra avec :

- devis ;
- cout estime ;
- lien de paiement.

## Phases

### Phase 1

- Coller lien produit.
- Traduction IA.
- Estimation cout.
- Acheter pour moi.

### Phase 2

- Integration 1688.
- Commandes groupees.
- Verification fournisseurs.
- Sourcing IA.

### Phase 3

- Centre de consolidation Chine.
- Partenariats logistiques.

### Phase 4

- Reseau de fulfilment africain.
- Systeme d'exploitation commercial Afrique-Chine.

## Risques a gerer

- estimation douane incorrecte ;
- delai fournisseur ;
- produit non conforme ;
- remboursement international ;
- variations de prix ;
- contrefacons ;
- droits d'importation ;
- attentes client trop elevees.

## Regle produit

Yapalaan Import doit etre vendu comme un service de devis et d'achat assiste, pas comme une promesse de livraison instantanee.

## Prochaine implementation

- Connecter le formulaire Import a Supabase.
- Creer table `import_requests`.
- Utiliser le fichier `supabase/yapalaan_import_requests.sql`.
- Creer statut : demande, devis, paiement, achat fournisseur, expedition, arrivee, livraison.
- Ajouter lien WhatsApp support import.
- Ajouter commission Yapalaan par demande.
