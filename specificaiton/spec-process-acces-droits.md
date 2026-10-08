---
title: 'Accès, invitation et droits'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [2, 3, 15, 16, 17]
maquette_revision: d6f296f
tags: [specification, process, glimlink]
---

# Accès, invitation et droits

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Définir les acteurs, l’invitation entreprise et les règles de visibilité entre établissements. La confidentialité concerne les données délivrées, documents et liens, au-delà des éléments masqués à l’écran.

## 2. Définitions

**Entreprise partenaire** : compte invité, un utilisateur en V1. **Conseiller** : professionnel rattaché à un établissement et à un périmètre. **Marque/campus** : organisation du centre définissant les viviers. **Conseiller référent** : auteur ou responsable de l’invitation, contact de l’entreprise. **Projection** : représentation des seules données autorisées pour un rôle.

## 3. Exigences, contraintes et recommandations

| ID          | Source                       | Exigence                                                                                                                       |
| ----------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| ACC-001     | PDF §3                       | Aucun accès par inscription publique ; invitation sécurisée générée par le conseiller.                                         |
| ACC-002     | PDF §3                       | Vérifier l’e-mail professionnel et recueillir raison sociale, SIRET, adresse, secteur, contact, fonction, téléphone et e-mail. |
| ACC-003     | PDF §2                       | Un utilisateur entreprise en V1 ; plusieurs besoins ; aucun compte étudiant.                                                   |
| ACC-004     | PDF §2, §15                  | Limiter le conseiller à son périmètre pour lecture, correction, publication et calendriers.                                    |
| SEC-ACC-001 | PDF §7, §15                  | Ne jamais transmettre à l’entreprise nom de famille étudiant, téléphone, e-mail ou adresse précise, ni brouillon non validé.   |
| SEC-ACC-002 | PDF §16                      | Authentifier et revérifier autorisation/disponibilité à l’ouverture des liens.                                                 |
| ACC-005     | Demande utilisateur          | Le conseiller peut voir et modifier les coordonnées personnelles des candidats de son vivier.                                  |
| ACC-006     | Demande utilisateur du 08/10 | L’invitation rattache l’entreprise à son conseiller référent ; son inscription alerte ce conseiller pour un premier appel.     |

## 4. Interfaces et contrats de données

| Acteur     | Peut consulter                                                        | Peut modifier                                                               | Restrictions                                                                |
| ---------- | --------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Entreprise | Ses besoins/demandes/alertes ; fiches publiées des viviers autorisés  | Ses besoins et sélections                                                   | Aucun accès aux coordonnées étudiant, brouillons ou notes de suivi internes |
| Conseiller | Fiches complètes, partenaires, besoins et demandes dans son périmètre | Fiches privées/professionnelles, publication, retrait, calendriers et suivi | Pas de droits automatiques sur une autre marque                             |
| Étudiant   | Aucun espace V1                                                       | Aucun parcours connecté V1                                                  | Information et exercice des droits à organiser hors compte                  |

Maquette : `companyStore`, `companyStudent` et `adviserStore` projettent les données. Le sélecteur d’entreprise est un outil de démonstration (six partenaires fictifs au départ). Le sélecteur de rôle permet la revue. L’activation est simulée ; `activatePartner` passe `verification` à `active`, conserve `adviserId` et crée `registeredAt` une seule fois. Mathilde JEANNE est l’unique conseillère référente du parcours principal.

## 5. Critères d’acceptation

- **AC-ACC-001** : une invitation peut être préparée, le profil entreprise renseigné puis l’e-mail vérifié dans la simulation.
- **AC-ACC-002** : une correction privée conseiller ne publie pas les modifications professionnelles en attente.
- **AC-ACC-003** : un changement de partenaire ne mélange pas ses besoins, demandes et alertes.
- **AC-ACC-004** : un conseiller hors périmètre ne peut consulter/modifier une fiche.
- **AC-ACC-005** : une ancienne notification ne réactive pas un profil retiré ou un besoin clôturé.

## 6. Stratégie de test

V3-11/V3-12 et tests d’isolation de `tests/domain.test.ts` ; parcours `qa-roles.js`, `qa-audit.js` et `qa-company-experience.js`. La production devra tester les autorisations API et fichiers : les tests de projection locale ne suffisent pas.

## 7. Justification et contexte

L’utilisateur a demandé de clarifier la différence entre contact de l’entreprise et contact du conseiller. L’entreprise est accompagnée par son référent ; le conseiller contacte les partenaires. Le compte étudiant demeure exclu malgré une formulation antérieure relative à ses notifications.

## 8. Dépendances et intégrations

Production : identité/session, validation e-mail, gestion des invitations et autorisations serveur. Durée, révocation et renouvellement des invitations, délégations et routage multi-conseillers restent à arbitrer. Héberger la maquette sur GitHub Pages ne constitue pas un contrôle d’accès sécurisé de l’application.

## 9. Exemples et cas limites

Une entreprise autorisée à une seule marque ne peut élargir ses droits en modifiant `schools` sur un besoin. Un brouillon n’apparaît pas dans les résultats. La démo contient physiquement les deux jeux de données fictives ; elle n’assure pas leur séparation de production.

## 10. Critères de validation

Revue de toutes les sources délivrées à l’entreprise, des périmètres et des liens historiques. Ne pas assimiler masquage CSS, sélecteur de rôle ou stockage local à une authentification réelle.

## 11. Spécifications liées

[Données](spec-schema-donnees.md), [Candidats](spec-data-candidats-cv.md), [Notifications](spec-process-notifications.md), [Arbitrages](spec-process-arbitrages.md).
