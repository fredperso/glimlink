---
title: 'Espace administrateur : formations, utilisateurs et entreprises'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [2, 6, 13, 15, 20, 'A', 'B']
maquette_revision: travail-local-USR-17
tags: [specification, design, glimlink]
---

# Espace administrateur

Évolution explicitement demandée le 8 octobre 2026 (USR-17), postérieure au PDF V3. La preuve applicative est la copie de travail locale ; aucune révision Git nouvelle n’est revendiquée.

## 1. Objet et périmètre

Ajouter un espace administrateur pour créer les formations avec leur planning et les compétences associées, gérer les plannings auparavant modifiables par le conseiller et ajouter des utilisateurs et entreprises avec leurs coordonnées.

## 2. Définitions

**Administrateur** : rôle chargé des référentiels et des ajouts d’utilisateurs/entreprises. **Utilisateur géré** : fiche de compte avec rôle et coordonnées ; pas une fiche candidat. **Compétence visée** : objectif pédagogique, distinct de l’acquisition individuelle. **Entreprise ajoutée** : partenaire préparé, dont l’activation reste à effectuer.

## 3. Exigences, contraintes et recommandations

| ID | Source | Exigence |
| --- | --- | --- |
| ADM-001 | Demande utilisateur USR-17 | Ajouter un troisième espace sélectionnable sur ordinateur et mobile : administrateur. |
| ADM-002 | Demande utilisateur USR-17 | Créer une formation avec nom, campus, période, rythme hebdomadaire/variable/inconnu, exceptions et compétences visées avec niveaux cibles. |
| ADM-003 | Demande utilisateur USR-17 | Transférer l’édition des formations et plannings partagés du conseiller vers l’administrateur ; maintenir la consultation et le rattachement des candidats côté conseiller. |
| ADM-004 | Demande utilisateur USR-17 | Ajouter un utilisateur avec prénom, nom, rôle, e-mail, téléphone, adresse et campus ; rattacher le rôle entreprise à une entreprise existante. |
| ADM-005 | Demande utilisateur USR-17 | Ajouter une entreprise avec raison sociale, secteur, ville, adresse, contact principal, fonction, téléphone, e-mail, campus et SIRET facultatif dans la démo. |
| ADM-006 | Constat de maquette | Conserver les ajouts dans le stockage local existant sans réinitialiser profils, besoins, sélections ni instantanés. |
| ADM-007 | Constat de maquette | Refuser les périodes incohérentes, compétences vides/doublonnées, e-mails de compte ou de partenaire doublonnés et rattachements entreprise absents. |
| ADM-008 | Simulation / §20 ouvert | La création d’un utilisateur n’authentifie personne ; la création d’une entreprise ne lui donne pas de vivier actif et ne simule pas son inscription. |

## 4. Interfaces et contrats de données

Routes `#/admin/home`, `#/admin/calendars`, `#/admin/users`, `#/admin/companies`. L’accueil présente les compteurs et trois actions d’ajout. Les listes utilisateurs/entreprises affichent coordonnées, recherche et rattachements.

La formation reste représentée par `Calendar`, avec `learningSkills: TrainingSkill[]`. Création et édition utilisent le même éditeur et l’aperçu mois/année/exceptions. Le campus d’une formation existante ne change pas afin de préserver les rattachements.

`Store.users?: ManagedUser[]` contient id, prénom, nom, rôle `admin/adviser/company`, e-mail, téléphone, adresse, campus, companyId facultatif. Les anciennes sauvegardes utilisent deux fiches d’équipe fictives jusqu’au premier ajout. Les projections conseiller/entreprise ne transmettent pas cet annuaire d’administration.

`PartnerCompany` conserve coordonnées, statut et périmètre. L’ajout admin prépare un partenaire `invited`, sans `registeredAt` ; l’activation existante reste nécessaire. Les valeurs obligatoires et la gestion des doublons sont des choix illustratifs de saisie à confirmer en production.

## 5. Critères d’acceptation

- **AC-ADM-001** : depuis l’espace administrateur, créer une formation avec période, jours de cours, compétence et niveau cible ; après rechargement elle figure dans le catalogue et le sélecteur candidat du campus. Modifier le planning existant reste hérité par ses étudiants (V3-05).
- **AC-ADM-002** : ajouter un utilisateur avec coordonnées ; le retrouver après rechargement. Un e-mail déjà présent, indépendamment de la casse, est refusé. Un utilisateur entreprise exige un rattachement existant.
- **AC-ADM-003** : ajouter une entreprise et retrouver ses coordonnées côté admin et dans les partenaires du conseiller de son campus. Elle reste à activer, sans nouvel événement d’inscription.
- **AC-ADM-004** : côté conseiller, consulter les calendriers et les formations de l’accueil sans contrôle d’édition ni dialogue vide ; conserver la gestion des candidats, compétences individuelles et demandes.
- **AC-ADM-005** : clavier, dialogues et navigation restent utilisables aux largeurs 1366, 390 et 320 pixels, sans débordement horizontal.
- **AC-ADM-006** : annuler un formulaire n’enregistre rien ; une erreur garde la saisie ; ajouter des objectifs de formation ne valide pas les compétences des candidats.

## 6. Stratégie de test

Tests métier de création, refus des rôles conseiller/entreprise, héritage, doublons et projections dans `tests/domain.test.ts`. Parcours navigateur d’administration dans `scripts/qa-administration.js` et couverture Playwright dans `tests/e2e/prototype.spec.ts`. La recette exécutée et les limites sont consignées au journal.

## 7. Justification et contexte

L’utilisateur demande de séparer l’administration des formations du travail de validation et de mise en relation du conseiller. Cette décision précise partiellement ARB-005 du §20 ; elle ne résout pas la matrice complète de droits.

## 8. Dépendances et intégrations

Référentiels locaux, stockage navigateur et parcours d’activation existant. Authentification, véritables comptes, invitation e-mail, délégations, droits multi-campus et routage dynamique des conseillers restent à réaliser/arbitrer.

## 9. Exemples et cas limites

Une formation créée à Atelier Campus devient un choix de rattachement candidat, sans publication automatique. Une entreprise ajoutée n’est pas immédiatement dans le sélecteur des partenaires actifs. Ajouter un conseiller dans l’annuaire ne remplace pas Mathilde JEANNE comme acteur fictif des parcours existants. Aucun compte étudiant n’est ajouté.

## 10. Critères de validation

Compiler la maquette autonome, exécuter les tests métier et vérifier les trois ajouts, la persistance, les liens conseiller et les vues mobiles. Ne pas déclarer la suite Playwright CLI réussie sur la seule base des parcours MCP. Le HTML contient toutes les données fictives ; le changement de rôle n’est pas une frontière de sécurité.

## 11. Spécifications liées

[Conseiller](spec-design-espace-conseiller.md), [Calendriers](spec-data-formations-calendriers.md), [Compétences](spec-data-competences.md), [Droits](spec-process-acces-droits.md), [Données](spec-schema-donnees.md), [Arbitrages](spec-process-arbitrages.md), [Recette](spec-process-recette.md).
