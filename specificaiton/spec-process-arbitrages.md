---
title: 'Arbitrages, écarts et travaux de production'
version: '1.7'
date_created: 2026-10-08
last_updated: 2026-10-24
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [20]
pdf_v6_sections: [18, 21]
maquette_revision: travail-local-USR-23
tags: [specification, process, glimlink]
---

# Arbitrages, écarts et travaux de production

Référence consolidée du PDF V3 et de la session utilisateur, confrontée à la copie de travail locale USR-17 (base `d6f296f`). Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## Table des matières

- [1. Objet et périmètre](#1-objet-et-périmètre)
- [2. Définitions](#2-définitions)
- [3. Exigences, contraintes et recommandations](#3-exigences-contraintes-et-recommandations)
- [4. Interfaces et contrats de données](#4-interfaces-et-contrats-de-données)
- [5. Critères d’acceptation](#5-critères-dacceptation)
- [6. Stratégie de test](#6-stratégie-de-test)
- [7. Justification et contexte](#7-justification-et-contexte)
- [8. Dépendances et intégrations](#8-dépendances-et-intégrations)
- [9. Exemples et cas limites](#9-exemples-et-cas-limites)
- [10. Critères de validation](#10-critères-de-validation)
- [11. Spécifications liées](#11-spécifications-liées)

## 1. Objet et périmètre

Préserver toutes les décisions ouvertes du §20 du PDF V3 et du §21 du [PDF V6](SOURCE_V6.md), les enrichir par les écarts constatés et par les questions du document « Questions V1 » (23 octobre 2026), et séparer les décisions utilisateur déjà prises des points restant à valider. Une règle déjà définie peut rester entièrement à développer : vrais comptes, données partagées, invitations et e-mails, traitement des CV et autorisations côté serveur. Cette liste n’est pas une autorisation de réaliser automatiquement de nouvelles fonctionnalités.

## 2. Définitions

**Ouvert** : décision absente. **Partiellement précisé** : une demande utilisateur fixe une partie du comportement. **Simulé** : parcours visible, service réel absent. **Écart** : différence explicitée entre cible et maquette ; pas nécessairement un défaut V1 obligatoire.

## 3. Exigences, contraintes et recommandations

| ID      | Source §20                     | Situation consolidée / décision attendue                                                                                                                                                                                 |
| ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ARB-001 | Données/publication            | Champs obligatoires définitifs, référentiel compétences, provenance, doublons, fréquence. Questions V1 : champs indispensables pour publier, détection des doublons, vérification des informations anciennes, distinction retrait du vivier / placement / suppression. La maquette exige prénom/formation/compétence/confirmation, sans validation définitive de cette liste. |
| ARB-002 | Formation/promotion            | Niveau du calendrier, groupes, rattachements multiples et données disponibles ; deux promotions d’une même formation avec des rythmes différents et passage à une nouvelle année. Recommandation non approuvée (Questions V1) : la formation porte les compétences visées, la promotion ou le groupe porte le planning, pour réutiliser une formation chaque année sans modifier le calendrier des anciens étudiants. Le code regroupe encore formation et calendrier ; le niveau (Bac+2/3/5) est déduit de l’intitulé (MAT-015). |
| ARB-003 | Granularité calendrier         | Demi-journées, périodes de stage et priorités d’exceptions. Mois/année/exceptions sont demandés et réalisés, sans arbitrer toute la granularité.                                                                         |
| ARB-004 | Matching                       | V6 : pertinence interne sans score visible (MAT-006). Restent ouverts : pondération exacte du moteur (V6 §21), exclusions, inconnues, compétences en acquisition, transferts, contribution des niveaux et du signal conseiller, calibrage ; l’éventuel seuil interne hérité des 60 % de la V3. La maquette applique −25 par conflit, −8 par inconnue, +3 pour le signal ; valeurs illustratives. |
| ARB-005 | Administration/droits          | USR-17 décide la création/édition de formations, l’ajout d’utilisateurs et d’entreprises dans un espace administrateur. V6 §2 fixe la hiérarchie Organisation → Campus → Écoles/Marques → Formations → Talents (ACC-007). Questions V1 : qui crée, modifie et désactive les comptes ; quels campus voit chaque conseiller ; quels viviers pour chaque entreprise ; remplacement d’un conseiller absent ; affectation réelle de candidats, entreprises et demandes à un conseiller ajouté et réaffectation du travail (la maquette repose sur une conseillère fictive unique). Permissions inter-marques et intégrations (V6 §21) ouvertes. |
| ARB-006 | Cycles de vie                  | Réouverture, correction d’une relation confirmée, plusieurs demandes concurrentes et modification après sélection. Questions V1 : refus du candidat, annulation par l’entreprise, entretien sans suite ; qui corrige une clôture et rouvre un besoin. Clôture sur confirmation de relation décidée par l’utilisateur ; V6 §17 confirme un suivi volontairement léger. |
| ARB-007 | CV/extraction                  | Formats, tailles, stockage, anonymisation technique (V6 §21), téléchargement, erreur d’extraction, audit et correction des extractions IA (V6 §21), conservation source/version entreprise. Questions V1 : fichiers acceptés, contenu exact montré à l’entreprise, contrôle qu’un document ou une observation ne révèle pas de coordonnées privées. Tout est simulé actuellement. |
| ARB-008 | Protection des données         | Information/base légale, consentement, droits sans compte étudiant, conservation, suppression, journalisation, âge et données transmises aux fournisseurs (V6 §18, §21). Questions V1 : moment où les coordonnées du candidat peuvent être communiquées, information du candidat, traitement de ses demandes de correction ou de suppression sans compte, responsabilités du centre et des entreprises. Formalisation avec le référent compétent, sans décision juridique inventée. |
| ARB-009 | Qualification réglementaire IA | Analyse du cadre applicable au classement/matching et responsabilités des acteurs avec les personnes compétentes. Aucune qualification conclue ici.                                                                      |
| ARB-010 | Notifications/routage          | Multi-marques, référent absent, republication, déduplication, délai mesurable, échec d’envoi (e-mail non délivré) et destinataire de chaque événement (Questions V1). V6 : premier appel après activation, alerte de non-sélection, routage du besoin validé vers le conseiller de la formation/niveau (ARB-019) ; Talent Alerts sans fréquence paramétrable en V1. |
| ARB-011 | Exploitation/intégrations      | USR-20 impose un cloud souverain européen et privilégie la France. Fournisseur, périmètre de souveraineté et éventuelle qualification SecNumCloud restent à décider ; volumes, temps de réponse, sécurité, sauvegardes, coût IA et intégrations futures restent ouverts. Pages héberge uniquement une démo statique. Deux variantes d’hébergement de la même image Docker sont décrites dans l’[architecture technique](spec-architecture-technique.md) : A, conteneurs serverless ; B, Docker Compose sur une instance (USR-27). La variante B est retenue (USR-28), chez OVHcloud avec Brevo pour les e-mails (USR-30). Restent à vérifier : garanties contractuelles, région, sous-traitants (dont l’infrastructure Google Cloud déclarée par Brevo, DCK-016) et besoin éventuel de l’offre SecNumCloud d’OVHcloud (AC-ARB-005).                                                                  |
| ARB-012 | Validation pilote              | Jeu expert, critères de recette, objectifs de découverte/sélection/relation/délai et périmètre du premier pilote. Recommandation Questions V1 : constituer avant le matching réel des besoins et candidats évalués par les conseillers (correspondance attendue, conflit, information manquante, profil intéressant malgré un parcours différent) pour vérifier l’ordre et la fidélité des explications. |
| ARB-013 | Extension compétences          | Valider niveaux, descriptions, objectifs pédagogiques et preuve d’acquisition ; exemples actuels ne sont pas un référentiel RNCP.                                                                                        |
| ARB-014 | Extension UX                   | Définir navigateurs/appareils cibles et recette Safari/clavier virtuel ; confirmer les choix visuels et accessibilité avec utilisateurs.                                                                                 |
| ARB-015 | Relais après non-sélection     | Seuil de déclenchement du relais (V6 §21). La maquette ne déclenche rien automatiquement : l’entreprise demande l’accompagnement ; le conseiller voit les pistes calculées. |
| ARB-016 | Observations conseiller        | Modèle des observations et du signal « à valoriser », traçabilité (qui, quand, quelle source), durée de conservation et formulation neutre par l’IA (V6 §15, §21). La maquette réutilise le champ d’observations et un booléen privé. |
| ARB-017 | Multi-sites                    | Gestion technique des sites (adresses structurées, site par besoin, effet sur la mobilité et la distance) (V6 §21). La maquette stocke une liste de libellés et préremplit le premier. |
| ARB-018 | Exposition                     | Règles d’exposition à pertinence comparable (rotation, équité entre profils, place du Déclic) (V6 §21). La maquette trie par pertinence, Déclic après profil direct à égalité. |
| ARB-019 | Routage conseiller             | Router le besoin validé vers le conseiller responsable de la formation/niveau tout en conservant le référent relationnel ; cas de plusieurs formations ou niveaux (V6 §16). Non réalisé : une conseillère fictive unique. |
| ARB-020 | Assouplissements V3            | La V6 ne reprend pas les assouplissements calculés de la V3 §9 côté entreprise. Décision de maquette USR-23 à confirmer : ils deviennent des pistes pour le conseiller dans le relais. |
| ARB-021 | Authentification (USR-24)      | MFA FIDO2 décidée et obligatoire pour conseillers et administrateurs (ACC-009). Restent ouverts : MFA obligatoire ou non pour les entreprises ; passkeys synchronisées acceptées ou clés matérielles exigées pour les administrateurs ; procédure de récupération d’accès ; durées des invitations (7 jours proposés) et des sessions (30 min / 2 h proposées). Propositions dans l’[architecture technique](spec-architecture-technique.md). |

Chaque arbitrage doit être clos par une décision datée/source explicite, avec mise à jour des exigences et de la recette. Un constat de code ne suffit pas.

## 4. Interfaces et contrats de données

| Domaine         | État de maquette                        | Service/capacité de production à réaliser                |
| --------------- | --------------------------------------- | -------------------------------------------------------- |
| Accès           | Changement de rôle et activation locale | Identité/session, liens sécurisés, contrôle serveur      |
| IA              | Règles lisibles, pertinence interne illustrative | Reformulation et extraction réelles, matching calibré, lecture personnalisée supervisée |
| CV              | Propositions/aperçu fictif              | Fichiers source, expurgation, accès et erreurs           |
| Notifications   | Stockage local et simulations           | Envoi e-mail, routage, file/réessai et métriques         |
| Persistance     | localStorage partagé par navigateur     | BDD, migrations, concurrence et sauvegarde               |
| Formations      | Création/édition administrateur locale        | Entités/référentiels et administration autorisée         |
| Confidentialité | Projections de champs et périmètres     | Autorisations API, fichiers, contrôles de textes publics |

Décisions utilisateur acquises : accueil sans exploration, swipe dans le besoin, sélection résumée avec suggestions distinctes, données personnelles éditables par conseiller, compétences structurées, mois/année, sélecteurs complets, pagination et navigation tactile, notification d’inscription et clôture à relation effectuée.

Décision USR-17 : transfert de l’édition des formations/plannings à l’administrateur, ajout d’utilisateurs et d’entreprises avec coordonnées. La démo impose nom/période/compétence pour une formation et coordonnées complètes pour les ajouts ; ces validations, le SIRET facultatif et l’unique référent fictif ne sont pas des arbitrages de production. Voir [administration](spec-design-espace-administrateur.md).

Décision USR-20 (8 octobre 2026) : hébergement de production sur un cloud souverain européen, de préférence en France (PRO-008). Cette demande fait évoluer la proposition de stack ANAL-002, sans valider un fournisseur ni demander une qualification SecNumCloud. Le périmètre à examiner comprend application, identité, base, CV, sauvegardes, journaux, e-mails et traitements IA, ainsi que les outils de livraison ayant accès à des secrets ou données. L’usage actuel de GitHub pour le code demeure autorisé ; ses accès et le périmètre de souveraineté de la chaîne de livraison restent à documenter.

## 5. Critères d’acceptation

- **AC-ARB-001** : chacun des 12 thèmes du §20 V3, chacun des 9 points du §21 V6 et chacun des 7 sujets du document « Questions V1 » possède une entrée ouverte ou partiellement précisée.
- **AC-ARB-002** : les décisions acquises n’apparaissent pas comme entièrement ouvertes, et leurs limites restent explicites.
- **AC-ARB-003** : aucune simulation n’est présentée comme service opérationnel.
- **AC-ARB-004** : une décision future met à jour le document thématique et la recette concernés, pas seulement cette liste.
- **AC-ARB-005** : le choix d’hébergement renseigne pour chaque service de son périmètre l’opérateur, la région, les sous-traitants et les flux de données. Les éléments non vérifiés et les éventuelles exceptions sont identifiés avant approbation. Si SecNumCloud est exigé ultérieurement, la preuve porte sur l’offre et les services effectivement qualifiés ; un projet en cours de qualification ne suffit pas.

## 6. Stratégie de test

Contrôle documentaire `spec:check`, revue de TRACEABILITE.md et relecture avec l’expert métier. Les arbitrages ne peuvent pas être résolus par un test automatisé ou une capture.

## 7. Justification et contexte

Le PDF précise que les descriptions V3 ne valident pas implicitement le §20. Cette séparation protège la qualité du cadrage et permet d’enrichir les spécifications sans confondre démonstration et produit prêt à exploiter.

## 8. Dépendances et intégrations

Responsable produit, expert alternance, administration du centre, référents données/sécurité/IA et future équipe de réalisation. Aucun fournisseur n’est approuvé contractuellement dans ce document. USR-24 (23 octobre 2026) décide un back Java, un front sans framework JavaScript et une MFA FIDO2 intégrée ; l’[architecture technique](spec-architecture-technique.md) propose Spring Boot, rendu serveur Thymeleaf/Bootstrap/htmx, PostgreSQL et, depuis USR-30, OVHcloud avec Brevo pour les e-mails. Elle remplace les propositions Node.js/Clever Cloud (USR-20), Scaleway Node.js (ANAL-003) et Django (ANAL-005). L’exigence éventuelle de qualification SecNumCloud reste ouverte.

## 9. Exemples et cas limites

Une demande de calendrier annuel ne décide pas le contrôle par demi-journées. Une demande de notification d’inscription ne définit pas le routage lorsque plusieurs conseillers invitent la même entreprise. Une clôture après mise en relation ne vaut pas placement de tous les candidats.

## 10. Critères de validation

Une décision est complète si responsable/source, règle, impact sur les données/permissions/parcours et cas de recette sont consignés. Les textes juridiques à appliquer seront déterminés par les référents ; ce document ne donne pas d’avis juridique.

## 11. Spécifications liées

[Source §20](SOURCE_V3.md), [Source V6 §21](SOURCE_V6.md), [Traçabilité](TRACEABILITE.md), [Gouvernance](spec-process-gouvernance.md), [Recette](spec-process-recette.md), [Couverture historique](../docs/SPEC_COVERAGE.md).
