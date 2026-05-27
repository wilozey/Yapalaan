# Revue sécurité et juridique - Yapalaan

Date : 2026-05-27

Statut : revue préparatoire. Validation juridique humaine requise avant publication.

## Références vérifiées

- Loi ivoirienne n°2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel.
- Loi ivoirienne n°2013-546 du 30 juillet 2013 relative aux transactions électroniques.
- L'ARTCI est l'autorité liée à la protection des données personnelles en Côte d'Ivoire.

Sources consultées :

- https://www.anssi.gouv.ci/reglementations/textes-nationaux/lois/
- https://www.artci.ci/index.php/33-actualites/informations-/434-declaration-a-l-occasion-de-la-journee-internationale-de-la-protection-des-donnees-personnelles.html
- https://www.gouv.ci/actualite/transactions-electroniques-lassemblee-nationale-adopte-le-projet-de-loi-2593
- https://www.unodc.org/cld/uploads/res/document/civ/a/Loi_transactions_electroniques.pdf

## Points juridiques à traiter avant live

- Déclaration ou autorisation du traitement de données personnelles auprès de l'autorité compétente, si applicable.
- Conditions d'utilisation finalisées.
- Politique de confidentialité finalisée.
- Politique de remboursement et litiges finalisée.
- Mention claire du rôle de Yapalaan : marketplace, tiers de confiance, ou vendeur direct selon les cas.
- Affichage clair du prix total, des frais de livraison et de la commission incluse.
- Process de retrait/suppression des données personnelles.
- Droit d'utilisation commerciale des images produits.

## Données personnelles traitées

- Téléphone acheteur.
- WhatsApp acheteur.
- Email acheteur.
- Géolocalisation et instructions de livraison.
- Téléphone, WhatsApp, email et géolocalisation vendeur.
- Notes livreurs.
- Historique de commande et support.

## Risques sécurité

- Écriture publique Supabase trop large si les politiques RLS ne sont pas durcies.
- Paiement réel non sécurisé si les clés prestataire sont exposées côté frontend.
- Absence d'authentification vendeur réelle.
- Absence de rôles admin/vendeur.
- Conservation de données de géolocalisation sans politique finale.
- Absence de journal opérationnel des litiges et remboursements.

## Mesures avant preview privée

- Appliquer `supabase/yapalaan_rls_hardening.sql`.
- Garder uniquement la clé anon dans le frontend.
- Ajouter un backend pour paiement réel.
- Utiliser HTTPS uniquement.
- Restreindre les domaines Supabase autorisés à `yapalaan.com`, `www.yapalaan.com`, `yapalaan.ci`, `www.yapalaan.ci` et au domaine preview.
- Tester les règles RLS avec utilisateur anonyme et vendeur.
- Ne pas activer les paiements réels avant webhooks et journal de commandes.
