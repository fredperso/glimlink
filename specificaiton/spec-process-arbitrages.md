---
title: 'Arbitrages, écarts et travaux de production'
version: '1.3'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [20]
maquette_revision: travail-local-USR-17
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

Préserver toutes les décisions ouvertes du §20 du PDF, les enrichir par les écarts constatés et séparer les décisions utilisateur déjà prises des points restant à valider. Cette liste n’est pas une autorisation de réaliser automatiquement de nouvelles fonctionnalités.

## 2. Définitions

**Ouvert** : décision absente. **Partiellement précisé** : une demande utilisateur fixe une partie du comportement. **Simulé** : parcours visible, service réel absent. **Écart** : différence explicitée entre cible et maquette ; pas nécessairement un défaut V1 obligatoire.

## 3. Exigences, contraintes et recommandations

| ID      | Source §20                     | Situation consolidée / décision attendue                                                                                                                                                                                 |
| ------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| ARB-001 | Données/publication            | Champs obligatoires définitifs, référentiel compétences, provenance, doublons, fréquence. La maquette exige prénom/formation/compétence/confirmation, sans validation définitive de cette liste.                         |
| ARB-002 | Formation/promotion            | Niveau du calendrier, groupes, rattachements multiples et données disponibles. Le code regroupe encore formation et calendrier.                                                                                          |
| ARB-003 | Granularité calendrier         | Demi-journées, périodes de stage et priorités d’exceptions. Mois/année/exceptions sont demandés et réalisés, sans arbitrer toute la granularité.                                                                         |
| ARB-004 | Matching                       | Pondérations, exclusions, inconnues, compatibilité obligatoire, transferts, contribution des niveaux/acquisitions et calibrage. Le seuil PDF est 60 %, avec confirmation/calibrage attendus.                             |
| ARB-005 | Administration/droits          | USR-17 décide la création/édition de formations, l’ajout d’utilisateurs et d’entreprises dans un espace administrateur. Délégations, matrice multi-campus, véritables comptes et routage restent ouverts.                                                                                  |
| ARB-006 | Cycles de vie                  | Réouverture, correction d’une relation confirmée, plusieurs demandes concurrentes et modification après sélection. Clôture sur confirmation de relation décidée par l’utilisateur.                                       |
| ARB-007 | CV/extraction                  | Formats, tailles, stockage, expurgation contrôlée, téléchargement, erreur d’extraction et conservation source/version entreprise. Tout est simulé actuellement.                                                          |
| ARB-008 | Protection des données         | Information/base légale, droits sans compte étudiant, conservation, suppression, journalisation, âge et données transmises aux fournisseurs. Formalisation avec le référent compétent, sans décision juridique inventée. |
| ARB-009 | Qualification réglementaire IA | Analyse du cadre applicable au classement/matching et responsabilités des acteurs avec les personnes compétentes. Aucune qualification conclue ici.                                                                      |
| ARB-010 | Notifications/routage          | Multi-marques, référent absent, republication, déduplication, délai mesurable, échec d’envoi et fréquence. Premier appel après inscription décidé ; canal réel complémentaire à fixer.                                   |
| ARB-011 | Exploitation/intégrations      | USR-20 impose un cloud souverain européen et privilégie la France. Fournisseur, périmètre de souveraineté et éventuelle qualification SecNumCloud restent à décider ; volumes, temps de réponse, sécurité, sauvegardes, coût IA et intégrations futures restent ouverts. Pages héberge uniquement une démo statique.                                                                  |
| ARB-012 | Validation pilote              | Jeu expert, critères de recette, objectifs de découverte/sélection/relation/délai et périmètre du premier pilote.                                                                                                        |
| ARB-013 | Extension compétences          | Valider niveaux, descriptions, objectifs pédagogiques et preuve d’acquisition ; exemples actuels ne sont pas un référentiel RNCP.                                                                                        |
| ARB-014 | Extension UX                   | Définir navigateurs/appareils cibles et recette Safari/clavier virtuel ; confirmer les choix visuels et accessibilité avec utilisateurs.                                                                                 |

Chaque arbitrage doit être clos par une décision datée/source explicite, avec mise à jour des exigences et de la recette. Un constat de code ne suffit pas.

## 4. Interfaces et contrats de données

| Domaine         | État de maquette                        | Service/capacité de production à réaliser                |
| --------------- | --------------------------------------- | -------------------------------------------------------- |
| Accès           | Changement de rôle et activation locale | Identité/session, liens sécurisés, contrôle serveur      |
| IA              | Mots-clés et scores illustratifs        | Extraction réelle, matching calibré et supervision       |
| CV              | Propositions/aperçu fictif              | Fichiers source, expurgation, accès et erreurs           |
| Notifications   | Stockage local et simulations           | Envoi e-mail, routage, file/réessai et métriques         |
| Persistance     | localStorage partagé par navigateur     | BDD, migrations, concurrence et sauvegarde               |
| Formations      | Création/édition administrateur locale        | Entités/référentiels et administration autorisée         |
| Confidentialité | Projections de champs et périmètres     | Autorisations API, fichiers, contrôles de textes publics |

Décisions utilisateur acquises : accueil sans exploration, swipe dans le besoin, sélection résumée avec suggestions distinctes, données personnelles éditables par conseiller, compétences structurées, mois/année, sélecteurs complets, pagination et navigation tactile, notification d’inscription et clôture à relation effectuée.

Décision USR-17 : transfert de l’édition des formations/plannings à l’administrateur, ajout d’utilisateurs et d’entreprises avec coordonnées. La démo impose nom/période/compétence pour une formation et coordonnées complètes pour les ajouts ; ces validations, le SIRET facultatif et l’unique référent fictif ne sont pas des arbitrages de production. Voir [administration](spec-design-espace-administrateur.md).

Décision USR-20 (8 octobre 2026) : hébergement de production sur un cloud souverain européen, de préférence en France (PRO-008). Cette demande fait évoluer la proposition de stack ANAL-002, sans valider un fournisseur ni demander une qualification SecNumCloud. Le périmètre à examiner comprend application, identité, base, CV, sauvegardes, journaux, e-mails et traitements IA, ainsi que les outils de livraison ayant accès à des secrets ou données. L’usage actuel de GitHub pour le code demeure autorisé ; ses accès et le périmètre de souveraineté de la chaîne de livraison restent à documenter.

## 5. Critères d’acceptation

- **AC-ARB-001** : chacun des 12 thèmes du §20 possède une entrée ouverte ou partiellement précisée.
- **AC-ARB-002** : les décisions acquises n’apparaissent pas comme entièrement ouvertes, et leurs limites restent explicites.
- **AC-ARB-003** : aucune simulation n’est présentée comme service opérationnel.
- **AC-ARB-004** : une décision future met à jour le document thématique et la recette concernés, pas seulement cette liste.
- **AC-ARB-005** : le choix d’hébergement renseigne pour chaque service de son périmètre l’opérateur, la région, les sous-traitants et les flux de données. Les éléments non vérifiés et les éventuelles exceptions sont identifiés avant approbation. Si SecNumCloud est exigé ultérieurement, la preuve porte sur l’offre et les services effectivement qualifiés ; un projet en cours de qualification ne suffit pas.

## 6. Stratégie de test

Contrôle documentaire `spec:check`, revue de TRACEABILITE.md et relecture avec l’expert métier. Les arbitrages ne peuvent pas être résolus par un test automatisé ou une capture.

## 7. Justification et contexte

Le PDF précise que les descriptions V3 ne valident pas implicitement le §20. Cette séparation protège la qualité du cadrage et permet d’enrichir les spécifications sans confondre démonstration et produit prêt à exploiter.

## 8. Dépendances et intégrations

Responsable produit, expert alternance, administration du centre, référents données/sécurité/IA et future équipe de réalisation. Aucun fournisseur ni architecture de production n’est sélectionné dans ce document. Proposition révisée non approuvée : conserver React/TypeScript/Vite et étudier un serveur Node.js, PostgreSQL, stockage privé compatible S3 et identité sur Clever Cloud en France. Les services complémentaires e-mail/IA et la chaîne de livraison sont soumis à la revue du périmètre USR-20. Scaleway constitue une alternative à étudier ; l’exigence éventuelle de qualification SecNumCloud reste ouverte.

## 9. Exemples et cas limites

Une demande de calendrier annuel ne décide pas le contrôle par demi-journées. Une demande de notification d’inscription ne définit pas le routage lorsque plusieurs conseillers invitent la même entreprise. Une clôture après mise en relation ne vaut pas placement de tous les candidats.

## 10. Critères de validation

Une décision est complète si responsable/source, règle, impact sur les données/permissions/parcours et cas de recette sont consignés. Les textes juridiques à appliquer seront déterminés par les référents ; ce document ne donne pas d’avis juridique.

## 11. Spécifications liées

[Source §20](SOURCE_V3.md), [Traçabilité](TRACEABILITE.md), [Gouvernance](spec-process-gouvernance.md), [Recette](spec-process-recette.md), [Couverture historique](../docs/SPEC_COVERAGE.md).
