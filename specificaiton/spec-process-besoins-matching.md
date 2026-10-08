---
title: 'Besoins, brief et matching explicable'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [4, 5, 7, 8, 9, 17]
maquette_revision: d6f296f
tags: [specification, process, glimlink]
---

# Besoins, brief et matching explicable

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Décrire un besoin avec des mots courants, valider un brief puis explorer des correspondances sans mélanger critères obligatoires, souhaitables et inconnues. L’exploration appartient à la rubrique Besoins.

## 2. Définitions

**Contrainte obligatoire** : critère à contrôler explicitement. **Souhaitable** : préférence distincte d’une obligation. **Flux principal** : résultats de score au moins 60 %, sous réserve des règles de compatibilité. **À découvrir** : profil moins évident avec justification documentée. **Inconnue** : donnée à vérifier, distincte d’un refus.

## 3. Exigences, contraintes et recommandations

| ID      | Source               | Exigence                                                                                                                      |
| ------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| MAT-001 | PDF §4               | Accepter une description libre, sans offre ni sélection de formation préalable.                                               |
| MAT-002 | PDF §4               | Proposer contrat, missions, compétences/domaines, lieu/mobilité, dates, obligations et souhaitables dans un brief modifiable. |
| MAT-003 | PDF §4.3             | Aucun matching avant confirmation explicite de l’entreprise.                                                                  |
| MAT-004 | PDF §4.4, §17        | Chaque besoin repart de zéro, sans préférences permanentes héritées.                                                          |
| MAT-005 | PDF §5               | Utiliser la fiche validée comme référence ; ne pas réextraire le CV pour écraser les corrections.                             |
| MAT-006 | PDF §5               | Le score appartient au couple profil/besoin ; seuil principal de référence 60 % ; ce n’est pas une probabilité d’embauche.    |
| MAT-007 | PDF §5               | Montrer correspondances, réserves, conflits et inconnues ; ne pas cacher une incompatibilité obligatoire.                     |
| MAT-008 | PDF §8               | Justifier À découvrir par un élément documenté ; ne pas en faire une liste de faibles scores ou de qualités IA présumées.     |
| MAT-009 | PDF §9               | Expliquer l’absence de match et proposer des assouplissements concrets sans les appliquer automatiquement.                    |
| MAT-010 | Décision utilisateur | Swipe par défaut au sein du besoin, avec gestes et boutons ; grille disponible.                                               |

## 4. Interfaces et contrats de données

Le brief représenté par `Need` sépare `description` initiale, `missions`, `proposedSkills`, `proposedDomains`, `requiredDays`, `licenseRequired`, `wishes`, `mobility`, `location`, `start/end`, `schools` et `validated`. `ValidatedBrief` présente les corrections confirmées aux deux rôles.

Dans la maquette, le préremplissage est basé sur quelques mots-clés et exemples ; les scores sont prédéfinis par profil/contrat. `classifyStudent` donne priorité aux conflits, puis aux informations inconnues, puis à une justification atypique, puis au seuil. Onglets : profils compatibles, à découvrir, à vérifier, conflits et profils passés. Ces règles illustratives n’arbitrent pas l’éligibilité finale de production.

Les assouplissements calculables comptent les gains sur les profils autorisés ; leur choix modifie le brief et remet `validated=false`, puis impose une confirmation. Le lieu, la mobilité et les compétences utilisent des sélections quand possible, avec Autre lorsque prévu.

## 5. Critères d’acceptation

- **AC-MAT-001** : tenter de poursuivre sans confirmer le brief affiche une erreur et n’ouvre aucun résultat.
- **AC-MAT-002** : une mission corrigée est affichée au conseiller, tandis que le texte initial reste identifié comme source.
- **AC-MAT-003** : une information inconnue apparaît À vérifier et n’est pas assimilée à une contrainte satisfaite.
- **AC-MAT-004** : un conflit scolaire conserve sa justification même si le score fictif est élevé.
- **AC-MAT-005** : une proposition d’assouplissement n’active pas le matching avant validation.
- **AC-MAT-006** : les flèches/clavier/boutons et les gestes permettent de sélectionner, passer et annuler ; le choix se rattache au bon besoin.

## 6. Stratégie de test

V3-02, V3-06–09 et tests de relaxation/isolation dans `tests/domain.test.ts` ; `qa-flows.js`, `qa-swipe.js`, `qa-audit.js`. La recette métier future compare les résultats à un corpus évalué par l’expert ; aucun moteur sémantique n’est calibré actuellement.

## 7. Justification et contexte

La simplicité de saisie doit coexister avec une confirmation des hypothèses. Les souhaitables ne compensent pas silencieusement les obligations. Le pourcentage demandé par l’utilisateur est conservé, avec le caractère fictif documenté.

## 8. Dépendances et intégrations

Fiches publiées, calendriers structurés et droits de vivier. Production : service de rapprochement sémantique, index de données validées et stratégie d’actualisation. Pondérations et contribution des niveaux/acquisitions restent à définir.

## 9. Exemples et cas limites

Cours mardi et présence mardi : conflit. Pas de mention du permis : inconnue. Expérience événementielle documentée : transfert possible en À découvrir. Vivier sans profil autorisé : aucun résultat fabriqué ni révélation d’un autre vivier.

## 10. Critères de validation

Confronter chaque filtre et explication aux données publiées et aux contrôles déterministes. Le seuil 60 % est une référence PDF ; sa confirmation dans un moteur réel et son interaction avec les exclusions demeurent au registre d’arbitrages.

## 11. Spécifications liées

[Calendriers](spec-data-formations-calendriers.md), [Fiches/CV](spec-data-candidats-cv.md), [Sélections](spec-process-selections-mises-en-relation.md), [Arbitrages](spec-process-arbitrages.md).
