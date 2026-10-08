---
title: 'Ergonomie, sélecteurs et navigation mobile'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [1, 7, 18]
maquette_revision: d6f296f
tags: [specification, design, glimlink]
---

# Ergonomie, sélecteurs et navigation mobile

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Garantir une lecture et des actions simples sur PC et téléphone : navigation tactile réactive, options entières, polices lisibles et états métier compréhensibles. Les ajustements demandés s’appliquent aux deux espaces.

## 2. Définitions

**Cible tactile** : zone interactive du bouton ou lien. **Focus visible** : repère de navigation clavier. **Popover** : couche d’affichage d’une liste hors des contraintes de découpe du conteneur. **Swipe** : geste horizontal pour passer/sélectionner ; le défilement vertical reste possible.

## 3. Exigences, contraintes et recommandations

| ID     | Source                            | Exigence                                                                                                    |
| ------ | --------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| UX-001 | PDF §1, §18 ; demande utilisateur | Interface simple et intuitive, utilisable sur mobile et ordinateur.                                         |
| UX-002 | Demande utilisateur               | Proposer des sélections plutôt qu’une saisie libre lorsque les valeurs sont connues, notamment la mobilité. |
| UX-003 | Demande utilisateur               | Les options et libellés des sélecteurs ne sont jamais coupés ou masqués.                                    |
| UX-004 | Demande utilisateur               | La barre mobile prend en compte un seul appui ; Accueil revient en haut même si déjà actif.                 |
| UX-005 | Demande utilisateur               | Les couleurs des cours, disponibilités et inconnues sont lisibles et compréhensibles.                       |
| UX-006 | Demande utilisateur               | Ajuster la typographie selon le contexte, éviter les champs trop petits sur mobile.                         |
| UX-007 | Accessibilité retenue             | Fournir labels, navigation clavier, fermeture par Échap, focus restauré et alternative aux gestes.          |
| UX-008 | Constat de maquette               | Les listes ouvertes restent dans l’écran et au-dessus de la barre inférieure.                               |

## 4. Interfaces et contrats de données

Le sélecteur d’espace affiche les deux options complètes dans un menu radio accessible. Les autres sélecteurs utilisent `Select` : bouton combobox, liste avec options multiligne, choix courant coché, hauteur limitée/défilante et couche popover, y compris en dialogue. Le select natif masqué conserve valeur de formulaire et validation ; les erreurs sont reliées au contrôle visible.

Clavier : flèches, Home/End, Entrée/Espace, recherche de préfixe, Échap et Tab. Clic extérieur ferme la liste. Les sélecteurs métier restent des choix, avec Autre lorsque le catalogue ne suffit pas.

Navigation : liens avec URL hash, état actualisé dès l’activation, focus contenu sans défilement parasite puis retour haut avant affichage. Une activation de destination courante ferme Plus et revient en haut. L’historique précédent/suivant et les clics avec modificateurs sont conservés.

Mesures de maquette : contrôles tactiles d’au moins 44 px, options de liste 48 px, champs mobiles à 16 px. Ces valeurs sont des choix de réalisation, pas une règle métier du PDF. Le mouvement réduit est respecté ; les couleurs ont des libellés et ne sont pas l’unique information.

## 5. Critères d’acceptation

- **AC-UX-001** : à 320 px et en paysage, les pages ne débordent pas horizontalement ; textes/menus restent lisibles.
- **AC-UX-002** : ouvrir une liste dans un dialogue présente les options complètes et n’empêche pas le premier appui sur le menu mobile.
- **AC-UX-003** : choisir une option par souris/clavier renseigne bien le formulaire ; les champs obligatoires produisent une erreur visible.
- **AC-UX-004** : appuyer une fois sur chaque onglet change la vue ; appuyer sur Accueil déjà actif remet `scrollY=0`.
- **AC-UX-005** : une interaction verticale avec une carte défile ; un petit geste horizontal ne sélectionne pas ; les boutons reproduisent les décisions.
- **AC-UX-006** : Échap ferme d’abord la liste, puis le dialogue lors d’une seconde activation, sans focus perdu.

## 6. Stratégie de test

`qa-mobile.js`, `qa-mobile-navigation.js`, `qa-selects.js`, `qa-role-picker.js`, `qa-swipe.js` et contrôles axe. Formats déjà contrôlés : jusqu’à 1920 px pour listes ; 320/375/390/430 et 740×390 pour mobile. Les émulations Chromium ne constituent pas une validation sur un iPhone physique/Safari.

## 7. Justification et contexte

Les demandes utilisateur ont remplacé les contrôles natifs visuellement tronqués par des listes communes et ont corrigé la navigation qui attendait le hashchange. Le retour sur une adresse inchangée doit rester une action utile.

## 8. Dépendances et intégrations

Navigateur moderne pour la prévisualisation. Aucun CDN nécessaire au livrable autonome. Cibles exactes de navigateurs, comportement du clavier virtuel et stratégie de compatibilité/fallback popover restent à valider pour la production.

## 9. Exemples et cas limites

Une option longue passe sur plusieurs lignes. Une liste de compétences longue défile au lieu de sortir de l’écran. Un menu Plus ouvert se ferme même si son lien mène à la page courante. Un écran réduit ne doit pas forcer une sélection par geste seul.

## 10. Critères de validation

Vérifier toucher/clavier, focus, orientations, contraste et absence de recouvrement sur les parcours réels. Les contrôles automatiques d’accessibilité ne remplacent pas un essai assistif ni la recette Safari/Android réelle.

## 11. Spécifications liées

[Entreprise](spec-design-espace-entreprise.md), [Conseiller](spec-design-espace-conseiller.md), [Calendriers](spec-data-formations-calendriers.md), [Recette](spec-process-recette.md).
