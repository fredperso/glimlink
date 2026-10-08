---
title: 'Compétences acquises et acquisitions en cours'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [5, 14, 20]
maquette_revision: d6f296f
tags: [specification, data, glimlink]
---

# Compétences acquises et acquisitions en cours

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Décrire l’extension utilisateur permettant d’ajouter/supprimer des compétences, leur donner un niveau actuel et distinguer acquis et acquisition en cours, avec lien éventuel vers une formation.

## 2. Définitions

**Acquise** : compétence dont l’état professionnel a été vérifié. **En cours d’acquisition** : apprentissage engagé, sans garantie de maîtrise finale. **Niveau actuel** : appréciation indépendante de l’état. **Objectif de formation** : compétence visée et niveau cible, pas un acquis individuel.

## 3. Exigences, contraintes et recommandations

| ID      | Source              | Exigence ou statut                                                                               |
| ------- | ------------------- | ------------------------------------------------------------------------------------------------ |
| CMP-001 | Demande utilisateur | Le conseiller ajoute, supprime et édite une compétence de son candidat.                          |
| CMP-002 | Demande utilisateur | Chaque compétence porte un niveau et un état acquis/en acquisition.                              |
| CMP-003 | Demande utilisateur | Une compétence peut être reliée à une formation et ce lien est visible.                          |
| CMP-004 | PDF §14 ; extension | Les changements suivent le brouillon puis la publication ; l’entreprise voit la version validée. |
| CMP-005 | Constat de maquette | Le catalogue de choix privilégie la sélection ; Autre autorise un libellé absent.                |
| CMP-006 | Constat de maquette | Empêcher un doublon de libellé normalisé ; ne pas créer une évaluation connue en migration.      |
| CMP-007 | Cohérence métier    | La fin d’une formation ne valide pas automatiquement un acquis ni son niveau.                    |
| CMP-008 | PDF §20             | Référentiel, preuve d’évaluation et effet sur le matching à arbitrer.                            |

## 4. Interfaces et contrats de données

`StudentSkill` : `id`, `name`, `level`, `status` (`acquired/learning`), `trainingId` ou null. `TrainingSkill` : `id`, `name`, `targetLevel`.

| Valeur technique | Libellé de maquette  |
| ---------------- | -------------------- |
| unknown          | À évaluer            |
| beginner         | Notions              |
| intermediate     | Pratique accompagnée |
| autonomous       | Autonome             |
| advanced         | Maîtrise avancée     |

Le formulaire présente niveau actuel, état d’acquisition et formation liée pour chaque compétence. Les objectifs de programme sont visibles et peuvent fournir une proposition d’acquisition à confirmer. Les exemples pédagogiques ne constituent pas un référentiel RNCP approuvé.

Migration des anciens libellés : garder le nom, état acquis hérité de l’ancienne fiche vérifiée, niveau À évaluer, aucun lien formation inventé. Déduplication sur le nom nettoyé, insensible aux accents, casse et espaces redondants.

## 5. Critères d’acceptation

- **AC-CMP-001** : ajouter une compétence avec niveau et état la rend visible dans le brouillon ; l’entreprise ne la voit qu’après publication.
- **AC-CMP-002** : supprimer une compétence du brouillon ne la retire pas de la version publiée avant validation.
- **AC-CMP-003** : une proposition issue de formation conserve acquisition en cours et niveau inconnu tant qu’aucune évaluation n’est renseignée.
- **AC-CMP-004** : saisir un doublon normalisé n’ajoute pas une deuxième compétence.
- **AC-CMP-005** : les anciennes données ne reçoivent ni niveau connu ni lien de formation fictif.

## 6. Stratégie de test

Tests de normalisation/ajout/publication de `tests/domain.test.ts` ; `qa-skills.js`, `qa-choices.js`, `qa-selects.js`. La validité du référentiel et des niveaux doit être revue avec l’expert métier, séparément de la validation UI.

## 7. Justification et contexte

La demande s’inspire des éditeurs de CV avec compétences structurées et niveaux. La maquette a retenu des choix textuels simples plutôt qu’une note chiffrée prétendument objective. L’état et le niveau ne sont pas fusionnés.

## 8. Dépendances et intégrations

Catalogue métier de compétences, formations et validation conseiller. La contribution exacte des compétences acquises/en acquisition au matching réel n’est pas définie ; les scores actuels ne démontrent pas ce calcul.

## 9. Exemples et cas limites

Excel peut être acquis avec niveau À évaluer. Une compétence peut être en acquisition et déjà pratiquée de façon accompagnée. Un niveau cible de formation n’est pas le niveau actuel du candidat. Retirer un lien formation ne doit pas supprimer la compétence.

## 10. Critères de validation

Vérifier l’indépendance des champs, la conservation lors de publication et la lisibilité côté entreprise. Les niveaux, descriptions et objectifs pédagogiques restent des choix de maquette à faire approuver.

## 11. Spécifications liées

[Candidats](spec-data-candidats-cv.md), [Calendriers/formations](spec-data-formations-calendriers.md), [Matching](spec-process-besoins-matching.md), [Arbitrages](spec-process-arbitrages.md).
