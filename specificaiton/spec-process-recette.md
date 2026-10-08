---
title: 'Recette fonctionnelle et limites de validation'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: ['B', 18, 19, 20]
maquette_revision: travail-local-USR-17
tags: [specification, process, glimlink]
---

# Recette fonctionnelle et limites de validation

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Définir une recette qui couvre les scénarios V3 du PDF et les évolutions utilisateur. Séparer les tests du modèle local, les parcours navigateur et la validation future du produit de production.

## 2. Définitions

**Test métier** : contrôle déterministe du modèle. **E2E** : parcours utilisateur automatisé de bout en bout. **MCP navigateur** : exécution des parcours dans le navigateur fourni à l’agent, avec HTML livré sur HTTP intercepté. **Recette expert** : comparaison des résultats à des cas évalués humainement.

## 3. Exigences, contraintes et recommandations

| ID      | Source               | Exigence                                                                                                                        |
| ------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| REC-001 | Annexe B             | Couvrir V3-01 à V3-12 sans remplacer les parcours préexistants et le jeu de cas expert.                                         |
| REC-002 | PDF §20              | Fixer avant pilote les cas métier, objectifs, tolérances et indicateurs de réussite.                                            |
| REC-003 | Fidélité des preuves | Distinguer validation locale et contrôles de sécurité/API/fichiers absents.                                                     |
| REC-004 | Demandes utilisateur | Ajouter les scénarios accueil simplifié, sélection résumée, suggestions, inscription notifiée, navigation mobile et sélecteurs. |
| REC-005 | Maintenabilité       | Mettre à jour les critères touchés à chaque nouvelle demande ; conserver leurs identifiants.                                    |
| REC-006 | Constat de projet    | Utiliser données fictives, remettre l’état de test à zéro et conserver les captures utiles.                                     |

## 4. Interfaces et contrats de données

Commandes : `rtk npm test` (tests métier Node), `rtk npm run build` (TypeScript + bundle + maquette autonome), `rtk npm run test:e2e` (Playwright Chromium disponible requis), `rtk npm run spec:check` (cohérence documentaire).

L’état applicatif de référence d6f296f a 48 tests métier réussis documentés. La suite CLI Playwright n’a pas été exécutée dans le sandbox ; les parcours équivalents ont été contrôlés via MCP Chromium. Cette consolidation documentaire ne crée pas de nouvelle validation applicative.

| Famille                                                             | Entrée existante                                                              |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Métier V3, isolation, compétences/calendriers, swipe, notifications | `tests/domain.test.ts`                                                        |
| Parcours PC/mobile                                                  | `tests/e2e/prototype.spec.ts`, `scripts/qa-flows.js`                          |
| Navigation tactile                                                  | `tests/e2e/mobile-navigation.spec.ts`, `scripts/qa-mobile-navigation.js`      |
| Nouveau parcours entreprise                                         | `scripts/qa-company-experience.js`                                            |
| Gestes/annulation/confidentialité                                   | `scripts/qa-swipe.js`                                                         |
| Fiches et données personnelles                                      | `scripts/qa-roles.js`                                                         |
| Compétences/calendriers                                             | `scripts/qa-skills.js`, `scripts/qa-calendars.js`                             |
| Choix et menus                                                      | `scripts/qa-choices.js`, `scripts/qa-selects.js`, `scripts/qa-role-picker.js` |
| Tableau paginé                                                      | `scripts/qa-talents-table.js`                                                 |
| Notifications                                                       | `scripts/qa-notifications.js`                                                 |
| Affichage mobile/audit                                              | `scripts/qa-mobile.js`, `scripts/qa-audit.js`                                 |

Les scripts MCP utilisent la maquette chargée par `qa-preview.local.js`, généré localement et ignoré par Git. Ne pas confondre un script enregistré avec un résultat de test exécuté.

## 5. Critères d’acceptation

| Cas PDF | Attendu                                                                         |
| ------- | ------------------------------------------------------------------------------- |
| V3-01   | Import = brouillon ; pas de profil ni alerte avant publication                  |
| V3-02   | Correction validée utilisée, sans remplacement par extraction initiale          |
| V3-03   | Nouveau CV = proposition à confirmer, sans écrasement                           |
| V3-04   | Permis absent = inconnu, pas non détenu                                         |
| V3-05   | Calendrier partagé hérité par deux profils                                      |
| V3-06   | Vendredi sans cours : absence de conflit scolaire, autres contraintes vérifiées |
| V3-07   | Cours mardi/présence mardi : conflit expliqué                                   |
| V3-08   | Planning absent : à vérifier, jamais disponibilité confirmée                    |
| V3-09   | Indisponibilité/date trop tardive reste opposable malgré l’absence de cours     |
| V3-10   | Retrait exclut nouveaux résultats et liens actifs                               |
| V3-11   | Pas de coordonnées privées dans réponses/API/documents entreprise               |
| V3-12   | Pas d’accès au vivier non autorisé                                              |

Ajouts de session : AC-ENT-001–007, AC-REL-001–006, AC-NOT-001–006, AC-UX-001–006 et AC-CMP-001–005 des documents liés. V3-11 et V3-12 ne sont validés actuellement que pour les projections et comportements locaux ; la cible complète reste à recetter.

- **AC-REC-ADM** : exécuter AC-ADM-001–006 de [l’administration](spec-design-espace-administrateur.md), incluant création, édition, persistance, coordonnées et consultation conseiller. V3-05 se joue désormais en administrateur pour l’édition.

- **AC-REC-NAV** : exécuter AC-UX-007 de [l’ergonomie mobile](spec-design-ergonomie-mobile.md) : Besoins → Plus, fermeture, réactivation de Besoins et passage aux demandes, avec une seule sélection visuelle.

## 6. Stratégie de test

Niveaux : tests métier deterministes, scénarios navigateur PC/mobile, analyse d’accessibilité et future intégration serveur/documentaire. Pas de seuil de couverture chiffré imposé. Recette mobile avec gestes réels émule hasTouch/isMobile ; une largeur réduite seule ne teste pas le toucher. Prévoir navigateurs/appareils réels avant production.

## 7. Justification et contexte

Le PDF demande un expert métier pour valider pertinence, impossibilités, inconnues et raisons. Des scores fictifs et des essais locaux ne prouvent pas un moteur IA pertinent ni une protection de données de production.

## 8. Dépendances et intégrations

Chromium Playwright, navigateur MCP, fichiers autonomes et fixtures pour la maquette. Pour le pilote : corpus représentatif validé, expert, environnements sécurisés et définition des indicateurs. Volumes, délais et charge restent à fixer.

## 9. Exemples et cas limites

Une capture visuelle est utile mais ne prouve pas le calcul de compteur. Une absence de violation axe ne prouve pas toute l’accessibilité. Un résultat MCP positif n’autorise pas la mention « suite CLI passée ». Une publication Pages vérifiée par contenu identique ne prouve pas l’authentification.

## 10. Critères de validation

Conserver commande/mécanisme exécuté, formats testés, résultat et limites dans le journal de validation. Avant livraison d’une évolution métier, vérifier les scénarios touchés ; élargir seulement si les changements ou échecs le justifient.

## 11. Spécifications liées

[Traçabilité](TRACEABILITE.md), [Validation historique](../docs/VALIDATION.md), [Entreprise](spec-design-espace-entreprise.md), [Droits](spec-process-acces-droits.md), [Arbitrages](spec-process-arbitrages.md).
