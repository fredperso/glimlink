---
title: 'Sélections, demandes et clôture des besoins'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [10, 12, 14, 15, 17, 20]
maquette_revision: d6f296f
tags: [specification, process, glimlink]
---

# Sélections, demandes et clôture des besoins

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Conserver les profils retenus pour chaque besoin et organiser une demande au conseiller. La mise en relation effectuée est un état confirmé humainement, distinct de l’envoi de la demande.

## 2. Définitions

**Sélection** : identifiants de profils retenus pour un besoin. **Demande** : sélection transmise au conseiller avec message et contexte. **Instantané** : brief et fiches publiées au moment de la demande. **Suggestion** : profil compatible existant, hors sélection et hors Talent Alerts de ce besoin. **Clôture** : arrêt de découverte et de nouvelles alertes du besoin.

## 3. Exigences, contraintes et recommandations

| ID      | Source                             | Exigence                                                                                                                     |
| ------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| REL-001 | PDF §10                            | Une sélection par besoin, sans limite fonctionnelle au nombre de profils.                                                    |
| REL-002 | PDF §10                            | L’entreprise demande la mise en relation ; le conseiller reçoit le brief, les profils et le contact entreprise autorisés.    |
| REL-003 | PDF §10                            | Le conseiller appelle l’entreprise, conseille, contacte les étudiants et organise les entretiens ; pas de rejet automatique. |
| REL-004 | PDF §10                            | Signaler les changements de calendrier/disponibilité/statut depuis la sélection/demande.                                     |
| REL-005 | Décision utilisateur du 08/10      | La confirmation Mise en relation effectuée clôture le besoin. Une demande reçue ou en cours ne le clôture pas.               |
| REL-006 | Décision utilisateur               | Ma sélection contient des résumés ouvrant la fiche complète publique et un bouton de demande au conseiller.                  |
| REL-007 | Décision utilisateur + réalisation | Les suggestions appartiennent au besoin et ne dupliquent pas ses Talent Alerts, ses profils retenus ni passés.               |
| REL-008 | PDF §12                            | Une fermeture manuelle peut arrêter un besoin devenu sans objet ; conserver son historique.                                  |

## 4. Interfaces et contrats de données

États de demande : `received` → `contacting` → `meeting` → `completed`, avec libellés Demande reçue, Prise de contact en cours, Entretien à organiser, Mise en relation effectuée. La maquette autorise le changement entre les trois premiers états ; `completed` est terminal dans son interface et clôture le besoin. Les permissions et corrections d’une confirmation erronée restent à définir pour la production.

`Request` contient besoin, profils, message, date, état, conseiller, instantané, date d’entretien envisagée et note interne de suivi. La note interne et l’état de lecture conseiller ne sont pas transmis à l’entreprise. Le contrôle d’une nouvelle demande nécessite besoin actif/validé et profils encore visibles ; un doublon portant sur la même sélection est refusé.

Ma sélection se concentre sur les besoins actifs. Les besoins clôturés gardent le brief et l’historique des demandes. Les profils retirés restent signalés mais ne sont pas admissibles à une nouvelle demande. `suggestedStudents` retourne jusqu’à trois profils compatibles existants, ordonnés par score fictif, en excluant les alertes même déjà lues de ce besoin.

## 5. Critères d’acceptation

- **AC-REL-001** : sélectionner/passer/annuler n’affecte que le besoin courant, sans doublon.
- **AC-REL-002** : envoyer deux fois la même sélection ne crée pas deux demandes identiques.
- **AC-REL-003** : le conseiller voit un changement intervenu depuis l’instantané.
- **AC-REL-004** : une demande reçue laisse le besoin actif ; sa confirmation completed le clôture sans fermer les autres besoins.
- **AC-REL-005** : après clôture, les compteurs affichent la mise en relation et retirent les alertes compatibles de ce besoin.
- **AC-REL-006** : un profil retiré n’est pas réactivé par une demande ou un ancien lien.

## 6. Stratégie de test

Tests `requestSelection`, swipe, changements d’instantanés, isolation et `updateRequestStatus` ; `qa-company-experience.js`, `qa-flows.js`, `qa-swipe.js`. Les essais de téléphone/entretien sont des parcours illustratifs, sans téléphonie ou agenda connecté.

## 7. Justification et contexte

L’utilisateur a précisé le lien entre relation effectuée et clôture. La maquette ajoute donc un état explicite, sans détourner Entretien à organiser. Les suggestions prolongent une sélection sans remplacer les alertes de nouveaux profils.

## 8. Dépendances et intégrations

Conseiller responsable et contact entreprise, fiches publiées disponibles, brief validé. Le routage multi-marques, une absence du conseiller, les demandes concurrentes et la réouverture après clôture restent à arbitrer.

## 9. Exemples et cas limites

Deux besoins peuvent sélectionner le même étudiant. Le retrait individuel après placement est manuel, indépendamment de la clôture d’un besoin. Clôturer une mise en relation ne constitue pas une preuve de contrat signé. Plusieurs demandes d’un besoin sont conservées, sans automatisme de fusion.

## 10. Critères de validation

Vérifier états, historisation, cloisonnement, absence de rejet automatique et séparation notes internes/entreprise. Le nombre du bouton d’accueil compte les demandes confirmées completed, pas les personnes retenues ni les entretiens à organiser.

## 11. Spécifications liées

[Entreprise](spec-design-espace-entreprise.md), [Notifications](spec-process-notifications.md), [Fiches](spec-data-candidats-cv.md), [Arbitrages](spec-process-arbitrages.md).
