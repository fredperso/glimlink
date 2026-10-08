---
title: 'Espace conseiller et vivier paginé'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [2, 6, 10, 13, 14, 15]
maquette_revision: d6f296f
tags: [specification, design, glimlink]
---

# Espace conseiller et vivier paginé

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Permettre au conseiller de gérer le vivier, vérifier les fiches, entretenir les calendriers, inviter les partenaires et traiter les demandes dans son périmètre. L’espace ne doit pas devenir un CRM supplémentaire.

## 2. Définitions

**Corrections en attente** : différences entre le brouillon et la fiche publiée. **Vivier en ligne** : profils publiés accessibles selon les droits. **Pagination** : découpage de la liste après recherche/filtrage. Le nom fictif de la conseillère est **Mathilde JEANNE**.

## 3. Exigences, contraintes et recommandations

| ID      | Source              | Exigence                                                                                                                    |
| ------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| CON-001 | PDF §13             | Donner accès aux fiches, brouillons, formations/calendriers, besoins partenaires et demandes à traiter.                     |
| CON-002 | Demande utilisateur | Le conseiller lit et modifie les données personnelles des candidats de son vivier.                                          |
| CON-003 | Demande utilisateur | Afficher les talents dans un tableau paginé utilisable sur mobile.                                                          |
| CON-004 | PDF §14             | Rendre visibles les corrections à contrôler avant nouvelle publication.                                                     |
| CON-005 | PDF §10, §15        | Montrer les profils, brief confirmé et contact entreprise de chaque demande autorisée.                                      |
| CON-006 | Demande utilisateur | L’espace conseiller propose Contacter l’entreprise, pas Contacter le conseiller.                                            |
| CON-007 | Demande utilisateur | La cloche présente des événements simulés réactifs ; l’inscription d’un partenaire déclenche un événement de premier appel. |
| CON-008 | PDF §6              | Les calendriers sont partagés ; leur modification est portée au niveau formation/promotion représenté.                      |

## 4. Interfaces et contrats de données

Navigation : `home`, `students`, `calendars`, `needs`, `requests`, `companies` sous `#/adviser/`. Sur mobile, les quatre premières vues sont dans la barre inférieure ; « Plus » donne accès aux demandes et partenaires.

Le tableau Talents affiche identité autorisée, formation, compétences, statut et ouverture de fiche. La pagination de maquette propose 5/10/20 lignes, 5 par défaut ; une recherche ou un filtre réinitialise la page, la taille aussi. Après réduction du résultat, la page effective reste valide. Les boutons précédent/suivant sont désactivés aux bornes. Le tableau devient des lignes empilées sur mobile, avec libellés de colonnes.

La liste partenaires comporte recherche, statut d’activation, parcours d’invitation et contact. Une inscription notifiée présente le téléphone pour l’appel initial. La fiche conseiller conserve les coordonnées privées indépendamment de la version professionnelle publiée.

## 5. Critères d’acceptation

- **AC-CON-001** : la liste initiale de 9 talents autorisés présente 5 lignes puis 4 sur la seconde page.
- **AC-CON-002** : filtrer/rechercher depuis la seconde page revient à la première sans ligne manquante.
- **AC-CON-003** : une fiche publiée avec modifications conserve sa version entreprise et affiche Corrections à valider.
- **AC-CON-004** : une demande donne accès à la fiche complète du candidat autorisé et signale les changements depuis sa création.
- **AC-CON-005** : le contact partenaire propose son e-mail/téléphone ; le conseiller ne se contacte pas lui-même.

## 6. Stratégie de test

`qa-talents-table.js`, `qa-roles.js`, `qa-audit.js`, `qa-company-experience.js` et tests d’isolation/corrections. `qa-mobile-navigation.js` vérifie Plus, la fermeture sur la destination courante et le retour Accueil.

## 7. Justification et contexte

La pagination répond à une demande de lisibilité. Les droits s’appliquent aux compteurs et tableaux, et pas seulement au dialogue de fiche. L’inscription du partenaire sert un premier échange humain, sans ajouter un module de prospection.

## 8. Dépendances et intégrations

Profils et calendriers du campus du conseiller ; besoins/demandes autorisés ; partenaires rattachés. Les rôles d’administration des formations et délégations entre conseillers restent ouverts.

## 9. Exemples et cas limites

Un filtre sans résultat affiche un état vide, pas une page vide numérotée hors bornes. Un profil retiré reste signalé dans la demande historique. Une entreprise inscrite n’obtient pas de besoin automatiquement.

## 10. Critères de validation

Vérifier pagination, stabilité des filtres, données privées, périmètres homogènes et absence de mauvais contact dans le menu. La pagination est locale ; performances et pagination serveur restent à dimensionner.

## 11. Spécifications liées

[Candidats/CV](spec-data-candidats-cv.md), [Compétences](spec-data-competences.md), [Calendriers](spec-data-formations-calendriers.md), [Droits](spec-process-acces-droits.md).
