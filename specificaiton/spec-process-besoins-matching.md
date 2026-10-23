---
title: 'Besoins, brief et matching explicable'
version: '1.2'
date_created: 2026-10-08
last_updated: 2026-10-23
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [4, 5, 7, 8, 9, 17]
pdf_v6_sections: [4, 5, 6, 7, 8, 9, 11, 19, 21]
maquette_revision: travail-local-USR-23
tags: [specification, process, glimlink]
---

# Besoins, brief et matching explicable

Référence consolidée du PDF V3, du [PDF V6 visuel](SOURCE_V6.md) intégré le 23 octobre 2026 (USR-23) et de la session utilisateur, confrontée à la copie de travail USR-23 (base publiée `f8f92e3`). Lorsque la V6 diffère de la V3, la V6 fait foi. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

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

Décrire un besoin par une phrase libre, vérifier la reformulation proposée (« Est-ce que j’ai bien compris ? »), puis explorer le vivier autorisé dans un ordre de pertinence interne, sans score visible ni rejet automatique. Les critères obligatoires, souhaitables et inconnus restent distincts.

## 2. Définitions

**Contrainte obligatoire** : critère écrit ou confirmé par l’entreprise et contrôlé explicitement. **Souhaitable** : préférence distincte d’une obligation. **Pertinence interne** : valeur qui ordonne la découverte pour un couple profil/besoin ; elle n’est jamais affichée (V6 §7). **Déclic Glimlink** : profil moins évident, présenté seulement si une passerelle est réellement explicable (V6 §8) ; remplace la zone « À découvrir » de la V3. **Lecture personnalisée** : distinction entre ce que la fiche prouve, ce qui peut être transféré et le lien avec chaque mission. **Inconnue** : donnée à vérifier, distincte d’un refus.

## 3. Exigences, contraintes et recommandations

| ID      | Source                      | Exigence                                                                                                                                                                                                                                       |
| ------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MAT-001 | PDF §4 ; V6 §4              | La première action est une phrase libre, sans offre ni formulaire préalable ni choix de formation ; bouton « Comprendre mon besoin ».                                                                                                             |
| MAT-002 | PDF §4 ; V6 §5              | La reformulation propose un intitulé modifiable, des missions, des compétences déduites supprimables/ajoutables, le lieu, le contrat, la formation suggérée, les niveaux acceptés, le permis, la langue, la disponibilité et les souhaitables. |
| MAT-003 | PDF §4.3 ; V6 §5            | Aucun matching avant confirmation explicite de l’entreprise.                                                                                                                                                                                   |
| MAT-004 | PDF §4.4, §17               | Chaque besoin repart de zéro, sans préférences permanentes héritées.                                                                                                                                                                           |
| MAT-005 | PDF §5                      | Utiliser la fiche validée comme référence ; ne pas réextraire le CV pour écraser les corrections.                                                                                                                                              |
| MAT-006 | V6 §1, §7, §19 (remplace PDF §5.3) | La pertinence appartient au couple profil/besoin et reste interne : aucun pourcentage ni score n’est visible. Le seuil de 60 % de la V3 ne sert plus à un flux visible ; il reste au plus une règle interne à arbitrer (ARB-004).        |
| MAT-007 | PDF §5                      | Montrer correspondances, réserves, conflits et inconnues ; ne pas cacher une incompatibilité obligatoire.                                                                                                                                     |
| MAT-008 | V6 §7-8 (remplace PDF §8)   | Le Déclic Glimlink est ponctuel et justifié par une passerelle explicable ; il ne transforme jamais une supposition en compétence et ne devance jamais un profil objectivement plus proche.                                                  |
| MAT-009 | V6 §11 (remplace PDF §9)    | Sans profil retenu, Glimlink propose l’intervention du conseiller plutôt que de conclure à l’absence de candidats ; les assouplissements calculés de la V3 deviennent des pistes destinées au conseiller, jamais appliquées automatiquement. |
| MAT-010 | Décision utilisateur ; V6 §9 | Swipe par défaut au sein du besoin, avec gestes et boutons ; grille « Tous les profils » sur le même vivier.                                                                                                                                 |
| MAT-011 | V6 §5, §19                  | Au moins 3 missions avant validation ; lieu obligatoire, prérempli depuis le site principal de l’entreprise et modifiable ; contrat Alternance/CPRO ou Stage ; niveaux Bac+2/Bac+3/Bac+5 en choix multiple ; disponibilité immédiate ou prochaine rentrée. |
| MAT-012 | V6 §6                       | Glimlink n’invente jamais une contrainte calendrier : sans jour de présence obligatoire écrit puis confirmé, aucun contrôle calendrier n’intervient. Une présence détectée est affichée et confirmée avant comparaison aux calendriers.         |
| MAT-013 | V6 §7, §19                  | Les évidences d’abord : les profils les plus directement alignés sont présentés en priorité. Aucun rejet automatique : tous les profils autorisés restent accessibles, y compris les profils passés ou en conflit.                          |
| MAT-014 | V6 §8-9                     | Pour chaque profil et chaque besoin, la lecture distingue ce que la fiche prouve, ce qui peut être transféré et pourquoi cela sert les missions ; une même fiche peut être expliquée différemment selon le besoin sans modifier ses faits. |
| MAT-015 | V6 §5, §7                   | Permis et langue sont des contraintes fortes seulement s’ils sont requis ; un niveau hors des niveaux acceptés est signalé comme conflit, sans exclure le profil.                                                                            |
| MAT-016 | V6 §5                       | Les compétences cochées ne sont pas l’unique source : les missions restent lues dans leur ensemble.                                                                                                                                           |

## 4. Interfaces et contrats de données

Le brief représenté par `Need` sépare `description` initiale, `title`, `missions`, `proposedSkills`, `proposedDomains`, `requiredDays`, `licenseRequired`, `language`/`languageLevel`, `levels`, `availability` (`immediate` ou `next-intake`), `suggestedTrainingId`, `wishes`, `mobility`, `location`, `start/end`, `schools` et `validated`. `helpRequestedAt`/`helpNotificationRead` portent le relais humain. `ValidatedBrief` présente les éléments confirmés aux deux rôles.

Dans la maquette, `proposeBrief` (`src/domain/brief.ts`) simule l’IA par des règles lisibles : missions reprises des mots de l’entreprise (« pour A, B et C ») ou d’un modèle d’exemple, jours de présence retenus seulement dans une phrase d’obligation (« obligatoire », « il faudrait », « présent ») et placés en souhaitable avec « utile », « serait », « idéalement » ; tous les niveaux restent cochés si aucun n’est écrit ; disponibilité « prochaine rentrée » si la rentrée ou septembre est mentionné. Ces règles illustratives ne constituent pas un moteur d’IA.

`relevance` calcule la pertinence interne (valeur fictive par profil/contrat, moins 25 par conflit et 8 par inconnue, plus 3 pour le signal conseiller), et `discoveryOrder` trie tous les profils visibles par pertinence décroissante, un profil Déclic passant après un profil direct à égalité. `classifyStudent` reste un classement interne pour les Talent Alerts et les suggestions. `trainingLevel` déduit le niveau de l’intitulé de formation (BTS → Bac+2, Bachelor → Bac+3, Master → Bac+5) en attendant un référentiel. `profileReading` (`src/domain/reading.ts`) produit la lecture personnalisée par recoupement de racines entre missions, compétences acquises/en acquisition et expérience ; une mission sans élément devient « À explorer avec le conseiller ».

`relaxationSuggestions` n’est plus proposé à l’entreprise : il alimente les pistes affichées au conseiller dans un relais demandé.

## 5. Critères d’acceptation

- **AC-MAT-001** : tenter de poursuivre sans confirmer la reformulation affiche une erreur et n’ouvre aucun résultat.
- **AC-MAT-002** : une mission corrigée est affichée au conseiller, tandis que le texte initial reste identifié comme source.
- **AC-MAT-003** : une information inconnue apparaît À vérifier et n’est pas assimilée à une contrainte satisfaite.
- **AC-MAT-004** : un conflit scolaire conserve sa justification et le profil reste accessible dans Tous les profils.
- **AC-MAT-005** : une piste d’assouplissement n’est montrée qu’au conseiller et ne modifie aucun besoin.
- **AC-MAT-006** : les flèches/clavier/boutons et les gestes permettent de sélectionner, passer et annuler ; le choix se rattache au bon besoin.
- **AC-MAT-007** : la phrase « Je recherche quelqu’un pour faire de l’administratif, gérer un portefeuille clients et effectuer des relances commerciales » produit 3 missions, le site principal comme lieu, aucun jour obligatoire, aucun permis, tous les niveaux acceptés.
- **AC-MAT-008** : « présent le vendredi » devient une présence obligatoire affichée ; « une présence le lundi serait utile » devient un souhaitable ; sans présence obligatoire, aucun contrôle ne mentionne le calendrier.
- **AC-MAT-009** : retirer une mission pour n’en garder que 2 bloque la validation avec un message ; aucun pourcentage n’apparaît ensuite dans la découverte.
- **AC-MAT-010** : la découverte présente tous les profils visibles dans un ordre de pertinence décroissante ; le profil Déclic ne devance aucun profil plus pertinent.

## 6. Stratégie de test

V3-02, V3-06–09 et tests V6 (`V6 §4-5`, `V6 §6`, `V6 §5`, `V6 §7`, `V6 §8-9`) dans `tests/domain.test.ts` ; tests Playwright « V6 — Besoin » et « Swipe ». La recette métier future compare l’ordre et les lectures à un corpus évalué par les conseillers (ARB-012) ; aucun moteur sémantique n’est calibré actuellement.

## 7. Justification et contexte

La V6 recentre l’IA : elle peut déduire pour aider, jamais inventer pour décider ; elle priorise et explique sans éliminer ni noter. Le pourcentage affiché demandé au départ de la maquette est donc retiré (USR-23). La simplicité de saisie coexiste avec une confirmation des hypothèses ; les souhaitables ne compensent pas silencieusement les obligations.

## 8. Dépendances et intégrations

Fiches publiées, calendriers structurés, niveaux de formation et droits de vivier. Production : reformulation par IA, service de rapprochement sémantique, index de données validées, stratégie d’actualisation et calcul de la pertinence côté serveur (le signal conseiller ne doit jamais transiter vers le client entreprise). Pondérations, exposition à pertinence comparable et contribution des niveaux/acquisitions restent à définir (ARB-004, ARB-018).

## 9. Exemples et cas limites

Cours mardi et présence obligatoire mardi : conflit visible, profil accessible. Pas de jour obligatoire : aucun contrôle calendrier, calendrier consultable sur la fiche. Pas de mention du permis : aucune contrainte de permis. Expérience événementielle documentée : Déclic possible, placé après les profils plus proches. Vivier sans profil autorisé : aucun résultat fabriqué, relais conseiller proposé, aucun autre vivier révélé.

## 10. Critères de validation

Confronter chaque reformulation, contrôle et explication aux données publiées et aux contrôles déterministes. Vérifier l’absence de score visible à l’écran, dans les messages et dans les exports. L’ordre de présentation est une simulation tant que les pondérations ne sont pas arbitrées et calibrées.

## 11. Spécifications liées

[Calendriers](spec-data-formations-calendriers.md), [Fiches/CV](spec-data-candidats-cv.md), [Sélections](spec-process-selections-mises-en-relation.md), [Espace entreprise](spec-design-espace-entreprise.md), [Arbitrages](spec-process-arbitrages.md), [Source V6](SOURCE_V6.md).
