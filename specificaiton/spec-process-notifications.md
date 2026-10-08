---
title: 'Notifications et premier contact entreprise'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [3, 11, 16, 17, 20]
maquette_revision: d6f296f
tags: [specification, process, glimlink]
---

# Notifications et premier contact entreprise

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Notifier l’entreprise des nouveaux profils et le conseiller des demandes ainsi que des inscriptions via invitation. Distinguer le contrat de production des événements locaux de la maquette.

## 2. Définitions

**Talent Alert** : nouveau profil validé compatible avec un besoin actif. **Notification d’inscription** : compte entreprise créé/activé à partir d’une invitation du conseiller. **Non lue** : événement dont le destinataire n’a pas confirmé la lecture. **Événement de bienvenue** : aide de démonstration qui ne représente aucun nouveau candidat.

## 3. Exigences, contraintes et recommandations

| ID      | Source                        | Exigence                                                                                                                      |
| ------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| NOT-001 | PDF §11                       | Créer une alerte lorsqu’un nouveau profil validé devient compatible avec un besoin actif autorisé.                            |
| NOT-002 | PDF §11                       | Un brouillon, une sauvegarde non publiée ou une proposition IA ne déclenche pas d’alerte.                                     |
| NOT-003 | PDF §16                       | Talent Alert entreprise in-app/e-mail ; nouvelle demande conseiller in-app/e-mail ; vérification e-mail entreprise.           |
| NOT-004 | PDF §16                       | Les liens exigent authentification et contrôle des droits/statut à l’ouverture.                                               |
| NOT-005 | Demande utilisateur           | Cloche fonctionnelle dans les espaces existants : badge, ouverture, événements simulés, lecture individuelle/totale.          |
| NOT-006 | Décision utilisateur du 08/10 | L’inscription via invitation alerte le conseiller référent pour un premier appel d’explication.                               |
| NOT-007 | Décision utilisateur          | Les compteurs Talent Alerts affichent uniquement les nouveaux profils compatibles, distincts des suggestions de Ma sélection. |
| NOT-008 | Confidentialité PDF           | Aucun e-mail ou message entreprise ne contient de coordonnées privées des étudiants.                                          |

## 4. Interfaces et contrats de données

| Événement                 | Destinataire           | Production attendue                           | Maquette actuelle                                            |
| ------------------------- | ---------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| Vérification de compte    | Entreprise             | E-mail/lien sécurisé                          | Formulaire et confirmation simulée                           |
| Nouveau profil compatible | Entreprise             | In-app + e-mail, lien vers besoin/profil      | Alerte locale à première publication ou bouton de simulation |
| Demande de relation       | Conseiller responsable | In-app + e-mail                               | Demande locale et cloche                                     |
| Inscription entreprise    | Conseiller référent    | Notification ; canal complémentaire à décider | Notification locale après activation vérifiée simulée        |

`NotificationItem` porte ID, titre, message, date, lecture, contexte besoin/profil ou entreprise. La lecture est limitée aux IDs visibles au destinataire. La première publication génère une alerte par besoin/profil sans doublon historique ; republication/actualisation restent ouvertes. Les boutons de simulation ne transmettent rien hors navigateur.

Un événement de bienvenue est ajouté à chaque contexte entreprise/conseiller, y compris sur des sauvegardes anciennes sans événements. Il explique la démonstration ; la cloche peut donc afficher un nombre supérieur au compteur Talent Alerts. `registeredAt`, `adviserId` et `registrationNotificationRead` permettent de notifier le référent sans duplication et de joindre l’entreprise.

## 5. Critères d’acceptation

- **AC-NOT-001** : publier un brouillon compatible produit une alerte ; le sauver uniquement n’en produit pas.
- **AC-NOT-002** : lire l’alerte d’une entreprise ne lit pas celle d’une autre entreprise.
- **AC-NOT-003** : le bouton Simuler crée un événement fictif visible et le badge est recalculé.
- **AC-NOT-004** : après inscription, le conseiller référent reçoit Nouvelle entreprise inscrite, avec accès au contact/téléphone ; rejouer l’activation ne duplique pas l’événement.
- **AC-NOT-005** : un lien vers un profil retiré ou un besoin clôturé ne permet plus de le consulter comme profil actif.
- **AC-NOT-006** : les suggestions ne prennent pas les candidats déjà associés aux Talent Alerts du besoin.

## 6. Stratégie de test

Tests notifications et activation dans `tests/domain.test.ts` ; `qa-notifications.js`, `qa-company-experience.js`. Les tests de livraison/réessai e-mail, délai, liens sécurisés et concurrence devront être ajoutés au service de production.

## 7. Justification et contexte

L’utilisateur a demandé une cloche réellement utilisable puis un événement d’inscription pour l’accompagnement initial. Aucun compte étudiant n’existe en V1 : les destinataires de la maquette sont entreprise et conseiller.

## 8. Dépendances et intégrations

Production : messagerie transactionnelle, authentification, routage vers le conseiller et préférences/fréquence d’envoi. Déduplication multi-marques, échec d’envoi, absence du référent et délai mesurable d’alerte restent à préciser.

## 9. Exemples et cas limites

Une ancienne sauvegarde vide conserve l’aide de bienvenue. Marquer tout comme lu ne modifie pas les demandes métier ni les coordonnées. Un nouveau profil compatible avec deux besoins peut produire deux événements ; le compteur global de nouveaux profils distincts peut rester à un.

## 10. Critères de validation

Vérifier le destinataire, le contexte et les compteurs. La présence d’une notification locale ne valide ni un e-mail envoyé ni un lien d’invitation sécurisé ; les documents et écrans doivent l’expliciter.

## 11. Spécifications liées

[Accès](spec-process-acces-droits.md), [Sélections](spec-process-selections-mises-en-relation.md), [Entreprise](spec-design-espace-entreprise.md), [Arbitrages](spec-process-arbitrages.md).
