---
title: 'Vision, périmètre et vocabulaire'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [1, 17, 18, 19]
maquette_revision: d6f296f
tags: [specification, design, glimlink]
---

# Vision, périmètre et vocabulaire

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Glimlink facilite le recrutement d’alternants et de stagiaires pour les entreprises partenaires d’un centre de formation. Le logiciel rapproche les besoins et les profils ; l’entreprise choisit ; le conseiller organise la relation. Le produit visé est MVP/V1 ; V3 désigne uniquement la révision du PDF.

## 2. Définitions

- **Vivier** : ensemble de profils d’un établissement, accessibles selon les autorisations.
- **Besoin** : recherche entreprise distincte, décrite et confirmée dans un brief.
- **Brief** : reformulation structurée du besoin, validée explicitement.
- **Talent** : étudiant représenté par une fiche vérifiée, sans identité complète côté entreprise.
- **Mise en relation** : démarche humaine orchestrée par le conseiller.
- **CRM/ERP/ATS** : outils de relation client, gestion de l’organisation ou suivi des candidatures ; Glimlink ne les remplace pas.

## 3. Exigences, contraintes et recommandations

| ID      | Source               | Exigence                                                                                                  |
| ------- | -------------------- | --------------------------------------------------------------------------------------------------------- |
| PRO-001 | PDF §1               | Permettre à une TPE/PME d’exprimer ses missions sans offre d’emploi ni choix préalable de diplôme.        |
| PRO-002 | PDF §1, §5           | Rapprocher compétences, expériences, formation, mobilité, disponibilité et calendrier, avec explications. |
| PRO-003 | PDF §1, §10          | Maintenir l’intermédiation du conseiller, sans contact entreprise–étudiant direct.                        |
| PRO-004 | PDF §19              | Représenter plusieurs besoins, sélections, alertes, fiches, calendriers et fondations multi-marques.      |
| PRO-005 | PDF §1.2             | Exclure CRM de prospection, admissions, Cerfa/contractualisation, suivi pédagogique et ATS complet.       |
| PRO-006 | PDF §2.3, §7         | Aucun compte étudiant V1 ; âge affiché prévu ultérieurement et à arbitrer.                                |
| PRO-007 | Demandes utilisateur | Concevoir une application simple utilisable sur mobile, avec listes de choix et swipe professionnel.      |

## 4. Interfaces et contrats de données

Deux espaces interactifs : entreprise et conseiller. La maquette utilise React/HTML/TypeScript, des données fictives et une prévisualisation autonome. Elle illustre les comportements sans serveur. Les scores, l’IA, les CV, l’authentification et les e-mails ne constituent pas des services opérationnels.

## 5. Critères d’acceptation

- **AC-PRO-001** : un utilisateur entreprise peut créer un besoin, comprendre les profils, retenir des talents et demander une mise en relation.
- **AC-PRO-002** : le conseiller peut enrichir et publier un profil puis traiter la demande.
- **AC-PRO-003** : les écrans n’exposent pas de fonctionnalités de CRM, d’admission ou de contractualisation non demandées.

## 6. Stratégie de test

Recette transverse des deux rôles dans `scripts/qa-flows.js`, complétée par les scénarios V3 et les tests des évolutions utilisateur. La validation du pilote et les objectifs chiffrés restent à fixer avec l’expert métier.

## 7. Justification et contexte

L’autonomie de découverte sert un processus accompagné. Un score seul ou une CVthèque ne satisfait pas la promesse. Le dernier accueil entreprise a volontairement été simplifié pour séparer accès rapide et exploration par besoin.

## 8. Dépendances et intégrations

Référentiel de formations, données validées du centre et expertise métier. En production : contrôle des accès, stockage de fiches/CV, services d’IA et de notifications. Aucune intégration CRM/ERP/ATS n’est actuellement connectée.

## 9. Exemples et cas limites

Une entreprise décrit de l’accueil et des devis sans connaître le BTS pertinent. Un candidat peut disposer d’une expérience transférable documentée. Un calendrier inconnu ne devient pas une disponibilité garantie.

## 10. Critères de validation

Vérifier la cohérence des rôles, l’explication des résultats, les chemins de sélection et l’absence de promesse de service réelle sur une simulation. Le périmètre exact du premier pilote reste un arbitrage.

## 11. Spécifications liées

[Entreprise](spec-design-espace-entreprise.md), [Conseiller](spec-design-espace-conseiller.md), [Matching](spec-process-besoins-matching.md), [Arbitrages](spec-process-arbitrages.md), [Source V3](SOURCE_V3.md).
