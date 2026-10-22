---
title: 'Ergonomie, sélecteurs et navigation mobile'
version: '1.4'
date_created: 2026-10-08
last_updated: 2026-10-22
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [1, 7, 18]
maquette_revision: travail-local-USR-22
tags: [specification, design, glimlink]
---

# Ergonomie, sélecteurs et navigation mobile

Référence consolidée du PDF V3 et de la session utilisateur, confrontée à la copie de travail USR-22 (base publiée `5bb345e`). Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

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

Garantir une lecture et des actions simples sur PC et téléphone : navigation tactile réactive, options entières, polices lisibles et états métier compréhensibles. Les ajustements demandés s’appliquent aux trois espaces.

## 2. Définitions

**Cible tactile** : zone interactive du bouton ou lien. **Focus visible** : repère de navigation clavier. **Popover** : couche d’affichage d’une liste hors des contraintes de découpe du conteneur. **Swipe** : geste horizontal pour passer/sélectionner ; le défilement vertical reste possible.

## 3. Exigences, contraintes et recommandations

| ID     | Source                            | Exigence                                                                                                    |
| ------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| UX-001 | PDF §1, §18 ; demande utilisateur | Interface simple et intuitive, utilisable sur mobile et ordinateur.                                         |
| UX-002 | Demande utilisateur               | Proposer des sélections plutôt qu’une saisie libre lorsque les valeurs sont connues, notamment la mobilité. |
| UX-003 | Demande utilisateur               | Les options et libellés des sélecteurs ne sont jamais coupés ou masqués.                                    |
| UX-004 | Demande utilisateur               | La barre mobile prend en compte un seul appui ; Accueil revient en haut même si déjà actif. Quand Plus est ouvert, lui seul est sélectionné visuellement ; sa fermeture restaure l’onglet de la page courante.                 |
| UX-005 | Demande utilisateur               | Les couleurs des cours, disponibilités et inconnues sont lisibles et compréhensibles.                       |
| UX-006 | Demande utilisateur               | Ajuster la typographie selon le contexte, éviter les champs trop petits sur mobile.                         |
| UX-007 | Accessibilité retenue             | Fournir labels, navigation clavier, fermeture par Échap, focus restauré et alternative aux gestes.          |
| UX-008 | Constat de maquette               | Les listes ouvertes restent dans l’écran et au-dessus de la barre inférieure.                               |
| UX-009 | Demande utilisateur USR-21        | Le look and feel s’inspire des applications de rencontre : palette chaude corail, cartes de profil immersives, formes arrondies, gestes et boutons d’action ronds. Les couleurs de disponibilité et de compétences ne changent pas de sens. |
| UX-010 | Constat de maquette USR-21        | Sur téléphone, les actions du swipe (Annuler, Passer, Sélectionner, Fiche complète) restent visibles au-dessus de la barre inférieure pendant la lecture de la carte. |
| UX-011 | Constat de maquette USR-21        | Les couleurs d’action conservent un contraste d’au moins 4,5:1 avec leur texte ; les dégradés vifs restent décoratifs. |
| UX-012 | Demande utilisateur USR-22        | Sur téléphone, le swipe est fluide : la carte suit le doigt sans re-rendu, tient compte de la vitesse (un geste rapide et court suffit), revient en place avec un effet ressort sous le seuil et révèle la carte suivante déjà affichée. |
| UX-013 | Demande utilisateur USR-22        | Sur ordinateur, la découverte n’impose pas le geste : fiche à tuiles (visuel, pourquoi ça matche, compétences, rythme), file d’attente cliquable, plateau « Ma sélection » et raccourcis clavier affichés (← passer, → sélectionner, ↑ fiche complète, retour arrière annuler). |

## 4. Interfaces et contrats de données

Le sélecteur d’espace affiche les trois options complètes dans un menu radio accessible. Les autres sélecteurs utilisent `Select` : bouton combobox, liste avec options multiligne, choix courant coché, hauteur limitée/défilante et couche popover, y compris en dialogue. Le select natif masqué conserve valeur de formulaire et validation ; les erreurs sont reliées au contrôle visible.

Clavier : flèches, Home/End, Entrée/Espace, recherche de préfixe, Échap et Tab. Clic extérieur ferme la liste. Les sélecteurs métier restent des choix, avec Autre lorsque le catalogue ne suffit pas.

Navigation : liens avec URL hash, état actualisé dès l’activation, focus contenu sans défilement parasite puis retour haut avant affichage. Une activation de destination courante ferme Plus et revient en haut. L’historique précédent/suivant et les clics avec modificateurs sont conservés.

Dans l’espace conseiller, ouvrir Plus sélectionne visuellement ce bouton et retire la surbrillance des onglets directs, sans changer la page ni son URL. Fermer Plus restaure l’onglet correspondant à la page courante ; choisir Demandes ou Entreprises maintient Plus sélectionné après fermeture. `aria-expanded` décrit le menu et `aria-current="page"` conserve la page réellement affichée.

Identité « rencontre » (USR-21) : couleur d’action corail `#cc1a47`, dégradé d’action `#e0264a → #cf3d23` (texte blanc lisible), dégradé décoratif `#ff4f6d → #ff8a4c`, encre aubergine `#2b1d2c` et fond crème `#fff8f5`. Chaque carte de profil présente l’avatar non identifiant sur un dégradé propre à la variante, le prénom, la formation et la ville en surimpression, et la compatibilité illustrative dans une pastille cœur. Boutons, onglets, pastilles et navigation active sont arrondis ; l’onglet actif de la navigation porte le dégradé d’action. Les jetons sont définis dans `src/styles.css` et l’habillage dans `src/rencontre.css` et `src/swipe.css`.

Mesures de maquette : contrôles tactiles d’au moins 44 px, options de liste 48 px, champs mobiles à 16 px. Ces valeurs sont des choix de réalisation, pas une règle métier du PDF. Le mouvement réduit est respecté ; les couleurs ont des libellés et ne sont pas l’unique information.

## 5. Critères d’acceptation

- **AC-UX-001** : à 320 px et en paysage, les pages ne débordent pas horizontalement ; textes/menus restent lisibles.
- **AC-UX-002** : ouvrir une liste dans un dialogue présente les options complètes et n’empêche pas le premier appui sur le menu mobile.
- **AC-UX-003** : choisir une option par souris/clavier renseigne bien le formulaire ; les champs obligatoires produisent une erreur visible.
- **AC-UX-004** : appuyer une fois sur chaque onglet change la vue ; appuyer sur Accueil déjà actif remet `scrollY=0`.
- **AC-UX-005** : une interaction verticale avec une carte défile ; un petit geste horizontal ne sélectionne pas ; les boutons reproduisent les décisions.
- **AC-UX-006** : Échap ferme d’abord la liste, puis le dialogue lors d’une seconde activation, sans focus perdu.

- **AC-UX-008** : sur les trois espaces, actions, navigation active et cartes de profil utilisent la palette chaude ; les cours restent bleus, les disponibilités potentielles et compétences acquises vertes, les périodes à vérifier orange.
- **AC-UX-009** : à 390 px, pendant le défilement d’une carte de swipe, les quatre actions restent visibles au-dessus de la barre inférieure, sans débordement horizontal, y compris pendant l’animation de sortie de la carte.
- **AC-UX-010** : le texte des boutons d’action et des onglets actifs atteint un contraste de 4,5:1.

- **AC-UX-011** : à 390 px, un glissé de 60 px laisse la même carte en place ; un glissé au-delà du seuil (28 % de la largeur, entre 70 et 120 px) ou un geste rapide de plus de 30 px décide dans sa direction ; aucun nœud DOM n’est ajouté ou retiré pendant le geste.
- **AC-UX-012** : à 1440 px, flèches gauche/droite, flèche haut et retour arrière passent, sélectionnent, ouvrent la fiche et annulent, hors champs de saisie et dialogues ; la file d’attente permet d’ouvrir un autre profil ; un profil retenu rejoint le plateau.

- **AC-UX-007** : depuis Besoins, ouvrir Plus ne laisse qu’un seul bouton sélectionné visuellement (Plus). Refermer le menu ou activer Besoins restaure sa sélection. Choisir Demandes/Entreprises ferme le menu et conserve Plus sélectionné. Vérifier à 320/390 px et en paysage 740×390.

## 6. Stratégie de test

`qa-mobile.js`, `qa-mobile-navigation.js`, `qa-selects.js`, `qa-role-picker.js`, `qa-swipe.js` et contrôles axe. Le test Playwright « Swipe : sélectionner ouvre le match, puis le choix reste annulable » couvre AC-ENT-008 sur ordinateur et téléphone, et « Swipe : raccourcis clavier et match limité à la première sélection » couvre AC-UX-012 ; AC-UX-011 a été vérifié par gestes simulés (Playwright, iPhone 13) ; les contrastes d’AC-UX-010 ont été calculés sur les jetons de couleur. Formats déjà contrôlés : jusqu’à 1920 px pour listes ; 320/375/390/430 et 740×390 pour mobile. Les émulations Chromium ne constituent pas une validation sur un iPhone physique/Safari.

## 7. Justification et contexte

Les demandes utilisateur ont remplacé les contrôles natifs visuellement tronqués par des listes communes et ont corrigé la navigation qui attendait le hashchange. Le retour sur une adresse inchangée doit rester une action utile. USR-21 rapproche la découverte des codes des applications de rencontre pour rendre la recherche d’alternants plus engageante, sans transformer la sélection en accord mutuel : seul le conseiller organise la rencontre.

## 8. Dépendances et intégrations

Navigateur moderne pour la prévisualisation. Aucun CDN nécessaire au livrable autonome. Cibles exactes de navigateurs, comportement du clavier virtuel et stratégie de compatibilité/fallback popover restent à valider pour la production.

## 9. Exemples et cas limites

Une option longue passe sur plusieurs lignes. Une liste de compétences longue défile au lieu de sortir de l’écran. Un menu Plus ouvert se ferme même si son lien mène à la page courante. Un écran réduit ne doit pas forcer une sélection par geste seul.

## 10. Critères de validation

Vérifier toucher/clavier, focus, orientations, contraste et absence de recouvrement sur les parcours réels. Les contrôles automatiques d’accessibilité ne remplacent pas un essai assistif ni la recette Safari/Android réelle.

## 11. Spécifications liées

[Entreprise](spec-design-espace-entreprise.md), [Conseiller](spec-design-espace-conseiller.md), [Calendriers](spec-data-formations-calendriers.md), [Recette](spec-process-recette.md).
