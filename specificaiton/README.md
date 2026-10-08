---
title: 'Spécifications fonctionnelles consolidées Glimlink V1'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
status: reference-consolidee
---

# Glimlink — spécifications consolidées V1

Ce répertoire `specificaiton/` conserve l’orthographe demandée et constitue la référence Markdown maintenue. Il consolide le [PDF fonctionnel V3](../Glimlink_Specifications_Fonctionnelles_Detaillees_V3.pdf) du 7 octobre 2026, les décisions de la session utilisateur et la maquette applicative `d6f296f` du 8 octobre 2026. **V3 est la révision du PDF ; le logiciel reste le MVP/V1.**

## Commencer la lecture

1. [Vision et périmètre](spec-design-produit.md).
2. [Parcours entreprise](spec-design-espace-entreprise.md) et [parcours conseiller](spec-design-espace-conseiller.md).
3. [Traçabilité du PDF et des évolutions](TRACEABILITE.md).
4. [Arbitrages et écarts de production](spec-process-arbitrages.md).
5. [Recette](spec-process-recette.md).

## Documents thématiques

Chaque fichier suit les 11 rubriques des skills de spécification : objet, définitions, exigences, interfaces/données, acceptation, tests, contexte, dépendances, exemples, validation et liens. Les exigences possèdent des identifiants stables. Les sources, les décisions utilisateur et les constats de réalisation sont distingués.

| Document                                                                                    | Sections du PDF couvertes |
| ------------------------------------------------------------------------------------------- | ------------------------- |
| [Gouvernance et mise à jour continue](spec-process-gouvernance.md)                          | 18, 20                    |
| [Vision, périmètre et vocabulaire](spec-design-produit.md)                                  | 1, 17, 18, 19             |
| [Accès, invitation et droits](spec-process-acces-droits.md)                                 | 2, 3, 15, 16, 17          |
| [Espace entreprise et accueil simplifié](spec-design-espace-entreprise.md)                  | 4, 7, 9, 10, 11, 12       |
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

## Sources et statut des informations

- [SOURCE_V3.md](SOURCE_V3.md) conserve une transcription textuelle du PDF, avec son empreinte SHA-256 ; aucune évolution ultérieure n’y est insérée. Le PDF reste l’original en cas de différence de présentation.
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

## Skills utilisés

Le nom exact `specifications` n’a pas été trouvé dans les skills locaux ni par la recherche disponible. Deux équivalents du dépôt GitHub officiel `awesome-copilot` ont été récupérés et lus : [create-specification](../tools/skills/create-specification/SKILL.md) et [update-specification](../tools/skills/update-specification/SKILL.md). Leurs [provenances](../tools/skills/create-specification/SOURCE.md) et licences sont conservées. Le répertoire demandé remplace leur chemin par défaut `/spec/` ; les rubriques sont en français.

Les anciens [documents de couverture](../docs/SPEC_COVERAGE.md), [audit](../docs/AUDIT_SPECIFICATIONS.md) et [validation](../docs/VALIDATION.md) apportent le contexte historique et les preuves. Les spécifications thématiques constituent désormais la lecture consolidée des règles.
