---
title: 'Arbitrages, écarts et travaux de production'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [20]
maquette_revision: d6f296f
tags: [specification, process, glimlink]
---

# Arbitrages, écarts et travaux de production

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

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
| ARB-005 | Administration/droits          | Création de formations/calendriers/conseillers, délégations et matrice multi-campus. Pas d’écran de création de formation actuellement.                                                                                  |
| ARB-006 | Cycles de vie                  | Réouverture, correction d’une relation confirmée, plusieurs demandes concurrentes et modification après sélection. Clôture sur confirmation de relation décidée par l’utilisateur.                                       |
| ARB-007 | CV/extraction                  | Formats, tailles, stockage, expurgation contrôlée, téléchargement, erreur d’extraction et conservation source/version entreprise. Tout est simulé actuellement.                                                          |
| ARB-008 | Protection des données         | Information/base légale, droits sans compte étudiant, conservation, suppression, journalisation, âge et données transmises aux fournisseurs. Formalisation avec le référent compétent, sans décision juridique inventée. |
| ARB-009 | Qualification réglementaire IA | Analyse du cadre applicable au classement/matching et responsabilités des acteurs avec les personnes compétentes. Aucune qualification conclue ici.                                                                      |
| ARB-010 | Notifications/routage          | Multi-marques, référent absent, republication, déduplication, délai mesurable, échec d’envoi et fréquence. Premier appel après inscription décidé ; canal réel complémentaire à fixer.                                   |
| ARB-011 | Exploitation/intégrations      | Volumes, temps de réponse, hébergement, sécurité, sauvegardes, coût IA et intégrations CRM/ERP/ATS futures. Pages héberge uniquement une démo statique.                                                                  |
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
| Formations      | Édition de calendriers existants        | Entités/référentiels et administration autorisée         |
| Confidentialité | Projections de champs et périmètres     | Autorisations API, fichiers, contrôles de textes publics |

Décisions utilisateur acquises : accueil sans exploration, swipe dans le besoin, sélection résumée avec suggestions distinctes, données personnelles éditables par conseiller, compétences structurées, mois/année, sélecteurs complets, pagination et navigation tactile, notification d’inscription et clôture à relation effectuée.

## 5. Critères d’acceptation

- **AC-ARB-001** : chacun des 12 thèmes du §20 possède une entrée ouverte ou partiellement précisée.
- **AC-ARB-002** : les décisions acquises n’apparaissent pas comme entièrement ouvertes, et leurs limites restent explicites.
- **AC-ARB-003** : aucune simulation n’est présentée comme service opérationnel.
- **AC-ARB-004** : une décision future met à jour le document thématique et la recette concernés, pas seulement cette liste.

## 6. Stratégie de test

Contrôle documentaire `spec:check`, revue de TRACEABILITE.md et relecture avec l’expert métier. Les arbitrages ne peuvent pas être résolus par un test automatisé ou une capture.

## 7. Justification et contexte

Le PDF précise que les descriptions V3 ne valident pas implicitement le §20. Cette séparation protège la qualité du cadrage et permet d’enrichir les spécifications sans confondre démonstration et produit prêt à exploiter.

## 8. Dépendances et intégrations

Responsable produit, expert alternance, administration du centre, référents données/sécurité/IA et future équipe de réalisation. Aucun fournisseur ni architecture de production n’est sélectionné dans ce document.

## 9. Exemples et cas limites

Une demande de calendrier annuel ne décide pas le contrôle par demi-journées. Une demande de notification d’inscription ne définit pas le routage lorsque plusieurs conseillers invitent la même entreprise. Une clôture après mise en relation ne vaut pas placement de tous les candidats.

## 10. Critères de validation

Une décision est complète si responsable/source, règle, impact sur les données/permissions/parcours et cas de recette sont consignés. Les textes juridiques à appliquer seront déterminés par les référents ; ce document ne donne pas d’avis juridique.

## 11. Spécifications liées

[Source §20](SOURCE_V3.md), [Traçabilité](TRACEABILITE.md), [Gouvernance](spec-process-gouvernance.md), [Recette](spec-process-recette.md), [Couverture historique](../docs/SPEC_COVERAGE.md).
