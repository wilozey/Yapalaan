# Suivi du plan Yapalaan jusqu'à publication

## Règle principale

Statut de publication : **bloqué volontairement**.

Yapalaan ne doit pas être publié tant que toutes les phases ci-dessous ne sont pas validées.

## Plan croissance et marketing

Statut : **préparé, exécution terrain requise**

- [x] Etape 2 à publication structurée dans `STEP_2_TO_LAUNCH_MASTER_PLAN.md`.
- [x] Playbook confiance et sécurité.
- [x] Playbook acquisition vendeurs.
- [x] Playbook marketing acheteurs.
- [x] Calendrier contenu 60 jours.
- [x] Tableau KPI et revenus.
- [ ] Recruter 50 vendeurs vérifiés.
- [ ] Obtenir 100 commandes réussies.
- [ ] Valider taux de livraison réussie de 90%.
- [ ] Lancer campagne payante après validation checkout/paiement.

## Phase 1 - MVP local

Statut : **validée localement**

- [x] Projet Yapalaan séparé du projet initial.
- [x] Application disponible en local.
- [x] Catalogue produits.
- [x] Images produits locales.
- [x] Recherche produit.
- [x] Filtres catégories et disponibilité.
- [x] Détail produit adapté au type d'article.
- [x] Checkout avec choix du livreur.
- [x] Modification du contact et de la géolocalisation de livraison.
- [x] Commande démo locale.
- [x] Suivi de commande local.
- [x] Espace vendeur démo.
- [x] Ajout produit vendeur démo.
- [x] Gestion disponible / vendu.
- [x] Gestion locale des livreurs.
- [x] Revue complète des écrans mobile.
- [x] Correction des premiers libellés temporaires.
- [x] Test manuel de tous les parcours.

## Phase 2 - Données produit

Statut : **validée localement, droits images à confirmer avant publication**

- [x] Valider les noms produits.
- [x] Valider les prix de vente.
- [x] Valider les prix estimés.
- [x] Valider les stocks.
- [ ] Confirmer les droits d'utilisation des images.
- [x] Ajouter descriptions finales courtes.
- [x] Supprimer les données de démonstration non nécessaires.
- [x] Remplacer les promesses marketing trop fortes par des preuves actuelles dans l'interface.

## Phase 3 - Vendeur

Statut : **validée localement, Supabase requis pour production**

- [x] Remplacer la session vendeur démo par une authentification locale préparatoire.
- [x] Créer le formulaire complet de boutique.
- [x] Sauvegarder boutique et produits en local.
- [x] Modifier produit.
- [x] Supprimer ou masquer produit.
- [x] Gérer commandes vendeur en local.
- [x] Préparer la vue payouts vendeur en simulation locale.

## Phase 4 - Livreurs et opérations

Statut : **validée localement, Supabase requis pour production**

- [x] Ajouter une liste temporaire de livreurs sur Abidjan.
- [x] Afficher un coût estimé de livraison par livreur.
- [x] Ajouter commission Yapalaan par livraison.
- [x] Ajouter livreur en local.
- [x] Retirer livreur en local.
- [x] Modifier coût de livraison.
- [x] Afficher disponibilité livreur.
- [x] Noter livreur après livraison.
- [x] Relier le livreur à la commande.
- [x] Ajouter vue admin minimale.

## Phase 5 - Supabase

Statut : **appliqué réellement, tests Supabase complets à finaliser**

- [x] Fichier `.env.example`.
- [x] Schéma SQL Supabase.
- [x] Guide de préparation Supabase.
- [x] Seed SQL Supabase avec produits et livreurs.
- [x] Mapping Supabase des champs produit, livreur et commission.
- [x] Script RLS durci préparé.
- [x] Runbook application réelle Supabase préparé.
- [x] Appliquer le schéma dans Supabase.
- [x] Ajouter clé anon publique dans `.env.local`.
- [x] Charger les 10 produits Yapalaan.
- [x] Charger les 12 livreurs temporaires Abidjan.
- [x] Ajouter les index de performance.
- [x] Ajouter la fonction checkout controlee.
- [x] Preparer l'Edge Function checkout serveur.
- [x] Brancher le frontend pour utiliser l'Edge Function quand son URL est configuree.
- [ ] Deployer l'Edge Function checkout sur Supabase.
- [ ] Retirer l'execution publique du checkout RPC SQL apres validation Edge Function.
- [ ] Revue sécurité Supabase sans alerte advisor.
- [x] Tester lecture produits via API publique.
- [x] Tester écriture commandes via API publique.
- [ ] Tester lecture produits depuis l'interface locale après redémarrage.
- [ ] Tester gestion vendeurs.
- [ ] Tester gestion livreurs.
- [x] Activer RLS correctement.

## Phase 6 - Paiement réel

Statut : **préparée localement, prestataire réel requis**

- [ ] Choisir prestataire final.
- [x] Préparer environnement test local.
- [ ] Tester paiement Mobile Money réel.
- [x] Gérer paiement échoué en simulation locale.
- [x] Gérer paiement réussi en simulation locale.
- [x] Garder l'argent protégé jusqu'à confirmation en logique locale.
- [x] Ajouter statut de remboursement / litige.

## Phase 7 - Sécurité et légal

Statut : **brouillons préparés, revue finale requise**

- [x] Conditions d'utilisation.
- [x] Politique de confidentialité.
- [x] Politique de remboursement.
- [x] Politique de litige.
- [x] Gestion données personnelles.
- [x] Revue juridique préparatoire avec références.
- [ ] Vérification permissions vendeur/admin.
- [ ] Revue sécurité Supabase.

## Phase 8 - Tests finaux

Statut : **plan prêt, tests réels requis**

- [ ] Test mobile réel.
- [ ] Test desktop.
- [x] Test checkout complet en local.
- [x] Test vendeur complet en local.
- [x] Test livreur complet en local.
- [ ] Test Supabase complet.
- [x] Test build production.
- [x] Revue UI finale locale.

## Phase 9 - Publication

Statut : **préparée, bloquée volontairement**

- [ ] Domaine.
- [x] Domaines acquis : `yapalaan.com` et `yapalaan.ci`.
- [ ] Hébergement.
- [x] Variables production documentées.
- [x] Runbook DNS/live préparé.
- [ ] Déploiement preview privé.
- [ ] Validation finale.
- [ ] Publication.

## Prochaine action active

Etape 2 a la publication preparee. Prochaine action obligatoire : deployer l'Edge Function `create-checkout-order`, finaliser le paiement test, puis commencer le recrutement vendeur avec le playbook.
