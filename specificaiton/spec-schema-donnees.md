---
title: 'Modèle de données et contrats de visibilité'
version: '1.1'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: ['A', 5, 6, 14, 15]
maquette_revision: travail-local-USR-17
tags: [specification, schema, glimlink]
---

# Modèle de données et contrats de visibilité

Référence consolidée du PDF V3 et de la session utilisateur, confrontée à la copie de travail locale USR-17 (base `d6f296f`). Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Consolider le modèle logique proposé en annexe A et le modèle TypeScript réellement utilisé. Le schéma décrit les informations et relations ; il ne fige pas des tables SQL ni des routes API qui n’existent pas.

## 2. Définitions

**Entité logique** : objet métier indépendant du découpage physique. **Instantané publié** : données confirmées utilisées par l’entreprise. **Contrat de visibilité** : champs et objets autorisés par destinataire. **Provenance** : origine d’une donnée ou proposition ; sa modélisation complète reste ouverte.

## 3. Exigences, contraintes et recommandations

| ID      | Source               | Exigence                                                                                                       |
| ------- | -------------------- | -------------------------------------------------------------------------------------------------------------- |
| DAT-001 | Annexe A             | Relier étudiant, établissement/marque, conseiller, formation/promotion et calendrier.                          |
| DAT-002 | Annexe A, §14        | Conserver les documents CV séparément de la fiche et distinguer source/version entreprise.                     |
| DAT-003 | Annexe A             | Distinguer privé/public, inconnu/négatif et dernière validation/validateur.                                    |
| DAT-004 | Annexe A, §5         | Les données indexées proviennent des données validées ; scores liés au couple candidat/besoin.                 |
| DAT-005 | PDF §10, §11         | Relier sélection, demande et alerte à leur besoin et candidats.                                                |
| DAT-006 | Demandes utilisateur | Représenter compétences avec niveau/état/lien formation et inscription du partenaire avec conseiller référent. |
| DAT-007 | Cohérence            | Préserver les corrections, instantanés et anciens profils sans remise à zéro lors d’une migration locale.      |

## 4. Interfaces et contrats de données

| Entité PDF           | Représentation actuelle                         | Écart ou remarque                                             |
| -------------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| Établissement/marque | Identifiants `school` et `schools`              | Pas d’administration autonome                                 |
| Conseiller           | IDs de référent/validateur et Mathilde JEANNE   | Pas de comptes serveur/délégations                            |
| Formation            | Titre/référence de Calendar                     | Formation/calendrier encore regroupés                         |
| Promotion/groupe     | Mention dans le titre de Calendar               | Pas d’entité ni rattachements multiples                       |
| Calendrier           | Calendar et CalendarException                   | Hebdomadaire/période/exceptions ; pas demi-journées           |
| Étudiant             | Student, StudentDetails, StudentPersonalDetails | Brouillon/publication/coordonnées privées séparés             |
| Document CV          | Aperçu et propositions fictifs                  | Aucun fichier source stocké ni modèle Document opérationnel   |
| Entreprise           | PartnerCompany                                  | Invited/verification/active, référent et inscription          |
| Besoin               | Need                                            | Brief, contraintes, droits, sélection/passes et actif/clôturé |
| Sélection            | `Need.selected`                                 | Liste locale d’IDs par besoin                                 |
| Demande              | Request avec snapshot                           | Suivi et note interne privée                                  |
| Alerte               | Alert ; notifications dérivées                  | Pas de service e-mail ni file d’événements                    |
| Compétence           | StudentSkill, TrainingSkill                     | Catalogue/niveaux illustratifs                                |

`Store.version=1` contient students/calendars/needs/requests/alerts et les partenaires/contexte actif ainsi que `users?: ManagedUser[]` (annuaire administrateur USR-17). Persistance locale : clé `glimlink-prototype-v1` ; chargement compatible avec anciens champs de compétences/coordonnées. Aucun schéma de BDD ni serveur n’est fourni.

Contrat entreprise : version professionnelle publiée seulement ; pas `personalDetails`, propositions/brouillons nouveaux, note interne `followUp` ni état de lecture conseiller. Contrat conseiller : objets de son école, coordonnées privées et brouillon. Les données de démonstration des trois rôles sont embarquées dans le même HTML, donc le contrat ne vaut pas isolation physique.

Contrat administrateur USR-17 : annuaire `ManagedUser` avec identité, rôle, coordonnées, campus et entreprise facultative ; accès aux formations et partenaires de démonstration. Projections entreprise/conseiller : `users` absent. Les anciennes sauvegardes restent compatibles. Voir [administration](spec-design-espace-administrateur.md), AC-ADM-002.

## 5. Critères d’acceptation

- **AC-DAT-001** : une ancienne compétence textuelle garde son nom sans niveau inventé.
- **AC-DAT-002** : une sauvegarde locale ancienne est complétée sans perdre ses besoins/sélections.
- **AC-DAT-003** : les champs privés supplémentaires ne traversent pas la projection entreprise.
- **AC-DAT-004** : l’instantané d’une demande conserve les données publiées de sa création.
- **AC-DAT-005** : une entreprise hors autorisation ne gagne pas de droits par un champ `schools` modifié sur son besoin.

## 6. Stratégie de test

`tests/domain.test.ts` couvre projections, migration de compétences, instantanés et isolation. Prévoir ensuite migrations BDD, tests de contrats API et fichiers, stockage et concurrence. Aucun pourcentage de couverture imposé actuellement.

## 7. Justification et contexte

Le PDF propose un modèle logique non normatif. La maquette choisit une représentation compacte ; documenter ses écarts empêche d’en déduire par erreur une architecture prête pour la production.

## 8. Dépendances et intégrations

Production : BDD structurée, stockage documentaire, identité, autorisations, index et journal d’événements. Choix de fournisseurs, technologies de persistance et schémas physiques non arrêtés.

## 9. Exemples et cas limites

Une modification de brouillon ne change pas le snapshot publié. Un profil retiré peut rester dans un historique sans être proposé. Le statut completed d’une demande ferme son besoin mais ne retire pas tous ses étudiants du vivier.

## 10. Critères de validation

Relire les types réellement utilisés : `src/domain/model.ts`, `partners.ts`, `skills.ts`, `calendar.ts`, `storage.ts`. Toute future API doit formaliser son contrat au moment où elle est décidée ; ne pas inventer ici des endpoints existants.

## 11. Spécifications liées

[Source/annexe A](SOURCE_V3.md), [Candidats](spec-data-candidats-cv.md), [Droits](spec-process-acces-droits.md), [Sélections](spec-process-selections-mises-en-relation.md).
