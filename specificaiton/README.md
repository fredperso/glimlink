---
title: 'Spécifications fonctionnelles consolidées Glimlink V1'
version: '1.4'
date_created: 2026-10-08
last_updated: 2026-10-24
status: reference-consolidee
---

# Glimlink — spécifications consolidées V1

Ce répertoire `specificaiton/` conserve l’orthographe demandée et constitue la référence Markdown maintenue. Il consolide le [PDF fonctionnel V3](../Glimlink_Specifications_Fonctionnelles_Detaillees_V3.pdf) du 7 octobre 2026, le [PDF V6 visuel](../Glimlink_Specifications_Fonctionnelles_Detaillees_V6_Visuelle-1.pdf) du 21 octobre 2026 (intégré le 23 octobre, USR-23), les décisions de la session utilisateur et la maquette applicative. **V3 et V6 sont des révisions du document ; le logiciel reste le MVP/V1.** Lorsque la V6 diffère de la V3, la V6 fait foi ; la V3 reste archivée.

## Table des matières

- [Table détaillée des 17 spécifications et de leurs rubriques](TABLE_DES_MATIERES.md).
- [Commencer la lecture](#commencer-la-lecture).
- [Documents thématiques](#documents-thématiques).
- [Sources et statut des informations](#sources-et-statut-des-informations).
- [Maintenir à chaque demande](#maintenir-à-chaque-demande).
- [État de référence](#état-de-référence).
- [Skills utilisés](#skills-utilisés).

## Commencer la lecture

1. [Vision et périmètre](spec-design-produit.md).
2. [Parcours entreprise](spec-design-espace-entreprise.md) , [parcours conseiller](spec-design-espace-conseiller.md) et [administrateur](spec-design-espace-administrateur.md).
3. [Traçabilité du PDF et des évolutions](TRACEABILITE.md).
4. [Arbitrages et écarts de production](spec-process-arbitrages.md).
5. [Recette](spec-process-recette.md).

## Documents thématiques

La [table des matières détaillée](TABLE_DES_MATIERES.md) permet de rejoindre directement chaque rubrique. Chaque document thématique possède aussi sa table locale.

Chaque fichier suit les 11 rubriques des skills de spécification : objet, définitions, exigences, interfaces/données, acceptation, tests, contexte, dépendances, exemples, validation et liens. Les exigences possèdent des identifiants stables. Les sources, les décisions utilisateur et les constats de réalisation sont distingués.

| Document                                                                                    | Sections du PDF couvertes |
| ------------------------------------------------------------------------------------------- | ------------------------- |
| [Gouvernance et mise à jour continue](spec-process-gouvernance.md)                          | 18, 20                    |
| [Vision, périmètre et vocabulaire](spec-design-produit.md)                                  | 1, 17, 18, 19             |
| [Accès, invitation et droits](spec-process-acces-droits.md)                                 | 2, 3, 15, 16, 17          |
| [Espace entreprise et accueil simplifié](spec-design-espace-entreprise.md)                  | 4, 7, 9, 10, 11, 12       |
| [Espace administrateur](spec-design-espace-administrateur.md) | Évolution USR-17 ; 2, 6, 13, 15, 20, A, B |
| [Espace conseiller et vivier paginé](spec-design-espace-conseiller.md)                      | 2, 6, 10, 13, 14, 15      |
| [Besoins, brief et matching explicable](spec-process-besoins-matching.md)                   | 4, 5, 7, 8, 9, 17         |
| [Fiche candidat, publication et CV](spec-data-candidats-cv.md)                              | 2, 5, 7, 14, 15           |
| [Compétences acquises et acquisitions en cours](spec-data-competences.md)                   | 5, 14, 20                 |
| [Formations, calendriers et présence potentielle](spec-data-formations-calendriers.md)      | 6, 14, 15, 17, 20         |
| [Sélections, demandes et clôture des besoins](spec-process-selections-mises-en-relation.md) | 10, 12, 14, 15, 17, 20    |
| [Notifications et premier contact entreprise](spec-process-notifications.md)                | 3, 11, 16, 17, 20         |
| [Ergonomie, sélecteurs et navigation mobile](spec-design-ergonomie-mobile.md)               | 1, 7, 18                  |
| [Modèle de données et contrats de visibilité](spec-schema-donnees.md)                       | A, 5, 6, 14, 15           |
| [Recette fonctionnelle et limites de validation](spec-process-recette.md)                   | B, 18, 19, 20             |
| [Arbitrages, écarts et travaux de production](spec-process-arbitrages.md)                   | 20                        |
| [Architecture technique de production](spec-architecture-technique.md) | USR-24 ; 2, 3, 14, 15, 16, 19, 20, A |

## Sources et statut des informations

- [SOURCE_V3.md](SOURCE_V3.md) et [SOURCE_V6.md](SOURCE_V6.md) conservent une transcription textuelle de chaque PDF, avec son empreinte SHA-256 ; aucune évolution ultérieure n’y est insérée. Les PDF restent les originaux en cas de différence de présentation. La V6 marque ses arbitrages par un surlignage, repris dans sa transcription.
- Le document « Questions V1 » (23 octobre 2026) liste des questions ouvertes et des recommandations ; il enrichit le [registre des arbitrages](spec-process-arbitrages.md) sans y valoir décision.
- Une **exigence PDF** reste la référence lorsqu’aucune décision utilisateur ne l’a fait évoluer.
- Une **décision utilisateur** indique une évolution explicite ; l’état du code apporte une preuve de réalisation, pas une décision implicite.
- Un **constat de maquette** peut être un choix illustratif à valider, notamment les niveaux de compétences, les scores, le découpage des données et certaines règles d’exceptions.
- Un **service simulé** n’est pas réalisé en production : authentification, invitations sécurisées, e-mails, extraction de CV, matching IA et stockage serveur sont absents.
- Un **arbitrage ouvert** est consigné sans décision inventée.

## Maintenir à chaque demande

La règle est inscrite dans [AGENTS.md](../AGENTS.md) et détaillée dans la [gouvernance](spec-process-gouvernance.md). À chaque demande : vérifier l’impact, actualiser les fichiers et critères concernés, consigner l’entrée dans [JOURNAL.md](JOURNAL.md), puis contrôler la cohérence. Une question sans changement fonctionnel est consignée avec cette mention et sa justification.

```sh
rtk npm run spec:check
```

Le contrôle vérifie structure, dates, liens locaux, couverture des 20 sections/annexes et références de recette. Il ne remplace pas la revue métier ni la vérification de l’impact réel d’une nouvelle demande.

## État de référence

La maquette d6f296f : accueil entreprise sans profils, swipe dans chaque besoin, sélection résumée avec suggestions distinctes des Talent Alerts, clôture à mise en relation confirmée, inscription entreprise notifiée au conseiller, vivier paginé, compétences avec niveaux/états, calendriers mois/année et sélecteurs accessibles. La validation précédente documente 48 tests métier réussis et des parcours navigateur MCP ; la suite CLI Playwright n’est pas déclarée exécutée.

Évolution USR-21 (22 octobre 2026) : habillage inspiré des applications de rencontre (palette corail, cartes immersives, boutons ronds, écran de sélection façon « match ») ; voir [ergonomie](spec-design-ergonomie-mobile.md) et [espace entreprise](spec-design-espace-entreprise.md).

Évolution USR-23 (23 octobre 2026) : intégration de la V6. Aucun score visible, trois espaces de découverte sur le même vivier, passer ≠ refuser, reformulation « Est-ce que j’ai bien compris ? » (3 missions minimum, lieu prérempli multi-sites, niveaux, langue, disponibilité), calendrier utilisé seulement si une présence obligatoire est exprimée, lecture personnalisée et Déclic Glimlink, relais humain vers le conseiller, observations et signal interne du conseiller, Mon profil. Voir [besoins et matching](spec-process-besoins-matching.md), [espace entreprise](spec-design-espace-entreprise.md) et [arbitrages](spec-process-arbitrages.md).

Décision USR-24 (23 octobre 2026) : back Java, front sans framework JavaScript (Bootstrap), MFA FIDO2 intégrée ; voir l’[architecture technique de production](spec-architecture-technique.md), proposition à valider en revue technique.

Contrainte acquise USR-20 : hébergement de production sur un cloud souverain européen, avec préférence pour la France. Le fournisseur et le périmètre de souveraineté restent à valider ; voir PRO-008 dans la [vision produit](spec-design-produit.md) et ARB-011 dans les [arbitrages](spec-process-arbitrages.md).

## Skills utilisés

Le nom exact `specifications` n’a pas été trouvé dans les skills locaux ni par la recherche disponible. Deux équivalents du dépôt GitHub officiel `awesome-copilot` ont été récupérés et lus : [create-specification](../tools/skills/create-specification/SKILL.md) et [update-specification](../tools/skills/update-specification/SKILL.md). Leurs [provenances](../tools/skills/create-specification/SOURCE.md) et licences sont conservées. Le répertoire demandé remplace leur chemin par défaut `/spec/` ; les rubriques sont en français.

Les anciens [documents de couverture](../docs/SPEC_COVERAGE.md), [audit](../docs/AUDIT_SPECIFICATIONS.md) et [validation](../docs/VALIDATION.md) apportent le contexte historique et les preuves. Les spécifications thématiques constituent désormais la lecture consolidée des règles.

Évolution examinée USR-17 : copie de travail locale du 8 octobre 2026, ajout de l’espace administrateur et transfert des formations/plannings ; voir [administration](spec-design-espace-administrateur.md).
