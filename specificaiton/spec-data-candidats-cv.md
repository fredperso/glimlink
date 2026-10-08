---
title: 'Fiche candidat, publication et CV'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [2, 5, 7, 14, 15]
maquette_revision: d6f296f
tags: [specification, data, glimlink]
---

# Fiche candidat, publication et CV

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Faire de la fiche structurée validée la source métier de publication et de matching. Le CV alimente des propositions à vérifier ; il n’est pas la référence qui écrase les corrections. Les champs privés et publics sont distincts.

## 2. Définitions

**Brouillon** : version corrigible non exploitée comme donnée confirmée. **Version publiée** : instantané des champs professionnels validés. **Coordonnées privées** : nom de famille, téléphone, e-mail, adresse précise. **Retrait** : désactivation du vivier, distincte d’une suppression des données.

## 3. Exigences, contraintes et recommandations

| ID          | Source              | Exigence                                                                                                       |
| ----------- | ------------------- | -------------------------------------------------------------------------------------------------------------- |
| FIC-001     | PDF §14             | Dépôt → préremplissage → correction → formation/calendrier → contrôle → publication explicite.                 |
| FIC-002     | PDF §14             | Une extraction échouée permet le remplissage manuel ; elle ne publie aucun profil automatiquement.             |
| FIC-003     | PDF §14.4           | Un nouveau CV propose des changements à accepter sans écraser les corrections validées.                        |
| FIC-004     | PDF §14, annexe A   | Conserver date de validation et identité du validateur, sous réserve de l’historisation à préciser.            |
| FIC-005     | PDF §14.5           | Un étudiant en entretien reste visible ; le conseiller retire manuellement un étudiant placé.                  |
| SEC-FIC-001 | PDF §7, §14         | La fiche entreprise et le CV destiné à l’entreprise ne révèlent aucun identifiant privé ni champ non autorisé. |
| FIC-006     | Demande utilisateur | Le conseiller modifie les coordonnées de son candidat indépendamment de ses corrections professionnelles.      |
| FIC-007     | PDF §5              | Une donnée absente conserve une valeur inconnue ; aucune compétence supposée ne devient validée implicitement. |

## 4. Interfaces et contrats de données

`Student` porte `school`, `status` (`draft/published/withdrawn`), `draft`, `published`, `validatedAt`, `validatedBy`, `adviserId`, `avatar`, propositions et `personalDetails` privées. `StudentDetails` porte prénom, lieu général, mobilité, formation, compétences, expérience, permis, disponibilité, indisponibilités et note publiée.

Maquette : coordonnées privées nom/e-mail/téléphone/adresse/code postal/ville éditables et fictives. La publication UI exige prénom, formation, au moins une compétence et confirmation du contrôle : choix de maquette, non liste définitive des champs obligatoires. Les nouvelles propositions de CV sont simulées et n’entrent dans le brouillon qu’après acceptation. L’aperçu CV est généré depuis la fiche publiée ; aucun vrai PDF source n’est lu, stocké ou expurgé.

La publication conserve un instantané séparé ; sauvegarder le brouillon ne remplace pas cet instantané. Les corrections en attente apparaissent au conseiller. Le retrait interdit une nouvelle découverte/demande et conserve un historique minimal.

## 5. Critères d’acceptation

- **V3-01** : importer un CV produit un brouillon, sans profil entreprise ni alerte avant publication.
- **V3-02** : après validation, les corrections du conseiller font référence.
- **V3-03** : un nouveau CV ne remplace pas automatiquement les valeurs validées.
- **V3-04** : permis non mentionné donne non renseigné, pas non détenu.
- **V3-10** : un profil retiré disparaît des nouveaux résultats et un ancien lien ne l’ouvre pas comme profil actif.
- **AC-FIC-001** : enregistrer l’e-mail privé ne publie pas simultanément les modifications professionnelles en attente.
- **V3-11** : les réponses et documents entreprise ne délivrent pas de coordonnées privées (contrôle serveur/fichier restant à réaliser).

## 6. Stratégie de test

Tests V3-01–04, V3-10–11 et tests des données privées dans `tests/domain.test.ts` ; `qa-roles.js`, `qa-skills.js`, `qa-flows.js`. Prévoir ultérieurement des fichiers réels avec erreurs d’extraction et vérification de leur expurgation.

## 7. Justification et contexte

Le conseiller est garant des données exposées. La provenance d’une extraction ne doit pas l’emporter sur une correction humaine confirmée. Le partage de la maquette ne signifie pas qu’elle peut contenir des coordonnées réelles d’étudiants.

## 8. Dépendances et intégrations

Production : stockage distinct des CV source et entreprise, extraction, contrôle de la version expurgée, autorisations fichiers et politique de conservation. Formats, tailles, téléchargement, provenance et doublons restent à formaliser.

## 9. Exemples et cas limites

Une ancienne validation sans nom de validateur connu est signalée, pas réinventée. Des coordonnées copiées dans un champ public libre doivent être détectées/contrôlées avant publication : la projection structurée seule ne les expurge pas. Une compétence nouvelle reste non validée jusqu’au contrôle.

## 10. Critères de validation

Vérifier brouillon/publication, absence d’écrasement, champs privés et retrait. La validation des vrais CV et des erreurs d’extraction n’est pas acquise par l’aperçu fictif.

## 11. Spécifications liées

[Compétences](spec-data-competences.md), [Données](spec-schema-donnees.md), [Droits](spec-process-acces-droits.md), [Recette](spec-process-recette.md).
