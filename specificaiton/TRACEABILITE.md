---
title: 'Traçabilité PDF, demandes et maquette'
date_created: 2026-10-08
last_updated: 2026-10-08
---

# Traçabilité

Le PDF V3 est archivé dans [SOURCE_V3.md](SOURCE_V3.md). Les décisions ci-dessous proviennent de la session utilisateur jusqu’au 8 octobre 2026. La preuve applicative examinée est la révision d6f296f ; les dates exactes des demandes anciennes ne sont pas réinventées.

## Couverture des sections et annexes

| PDF | Sujet                           | Document consolidé                                            | Situation                                                                                     |
| --- | ------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | Vision et limites               | [Spécification](spec-design-produit.md)                       | Cadrage conservé ; accueil simplifié sans changer la promesse                                 |
| 2   | Acteurs et rôles                | [Spécification](spec-process-acces-droits.md)                 | Entreprise/conseiller/admin (USR-17) ; aucun compte étudiant ; données privées modifiables dans le périmètre |
| 3   | Invitation et compte entreprise | [Spécification](spec-process-acces-droits.md)                 | Activation et référent simulés ; inscription notifiée                                         |
| 4   | Besoin naturel                  | [Spécification](spec-process-besoins-matching.md)             | Champ accueil conservé au formulaire ; confirmation explicite                                 |
| 5   | Matching                        | [Spécification](spec-process-besoins-matching.md)             | Contrôles structurés ; scores et IA simulés ; critères à arbitrer                             |
| 6   | Calendrier partagé              | [Spécification](spec-data-formations-calendriers.md)          | Héritage, exceptions datées, vues mois/année ; pas de demi-journées                           |
| 7   | Swipe et profil                 | [Spécification](spec-design-ergonomie-mobile.md)              | Swipe dans Besoins, grille explicite ; confidentialité de la fiche publiée                    |
| 8   | À découvrir                     | [Spécification](spec-process-besoins-matching.md)             | Justifications atypiques ; pas une liste de faibles scores                                    |
| 9   | Absence de match                | [Spécification](spec-process-besoins-matching.md)             | Explications, gains d’assouplissement et confirmation avant reprise                           |
| 10  | Sélection et relation           | [Spécification](spec-process-selections-mises-en-relation.md) | Résumés/suggestions par besoin ; completed ajouté, clôture explicite                          |
| 11  | Talent Alerts                   | [Spécification](spec-process-notifications.md)                | Événements par besoin et compteur de nouveaux profils compatibles                             |
| 12  | Dashboard entreprise            | [Spécification](spec-design-espace-entreprise.md)             | Ancien accueil remplacé par recherche + trois compteurs + référent                            |
| 13  | Dashboard conseiller            | [Spécification](spec-design-espace-conseiller.md)             | Tableau paginé et demandes/partenaires dans Plus sur mobile                                   |
| 14  | Fiche et CV                     | [Spécification](spec-data-candidats-cv.md)                    | Brouillon/publication préservés ; CV réels non traités                                        |
| 15  | Campus/marques                  | [Spécification](spec-process-acces-droits.md)                 | Périmètres projetés ; contrôle serveur/routage complet à réaliser                             |
| 16  | Notifications                   | [Spécification](spec-process-notifications.md)                | Cloche, lecture et événement d’inscription ; e-mails simulés                                  |
| 17  | Règles V1                       | [Spécification](spec-design-produit.md)                       | Reprises dans les thèmes ; modifications utilisateur tracées                                  |
| 18  | Priorités                       | [Spécification](spec-process-gouvernance.md)                  | Simplicité, explicabilité et tenue continue des spécifications                                |
| 19  | Périmètre MVP                   | [Spécification](spec-design-produit.md)                       | Périmètre cible conservé, simulations et services absents explicités                          |
| 20  | Décisions ouvertes              | [Spécification](spec-process-arbitrages.md)                   | 12 thèmes repris ; extensions UX/compétences et décisions partielles                          |
| A   | Modèle logique                  | [Spécification](spec-schema-donnees.md)                       | Comparaison des entités logiques au modèle TypeScript                                         |
| B   | Scénarios de recette            | [Spécification](spec-process-recette.md)                      | V3-01 à V3-12 + critères des évolutions utilisateur                                           |

## Évolutions de la session

| Référence | Décision ou demande                                                               | Règles / fichiers concernés         | Preuve dans le projet                                      |
| --------- | --------------------------------------------------------------------------------- | ----------------------------------- | ---------------------------------------------------------- |
| USR-01    | Conseillère Mathilde JEANNE, contact adapté au rôle                               | ACC-006, CON-006 ; accès/conseiller | App, AdviserCard, Contact                                  |
| USR-02    | Autres partenaires fictifs                                                        | Accès et espace conseiller          | `src/domain/partners.ts`, page Companies                   |
| USR-03    | Conseiller peut modifier les coordonnées privées                                  | ACC-005, FIC-006                    | PersonalDetailsEditor, savePersonalDetails, tests          |
| USR-04    | Compétences ajout/suppression, niveau, acquis/en acquisition, formation           | CMP-001–008                         | Skills, domain/skills, tests et qa-skills                  |
| USR-05    | Calendrier éditable, mois/année et couleurs lisibles                              | CAL-007–008                         | CalendarEditor, CalendarViews, calendar.ts                 |
| USR-06    | Swipe entreprise et mode par défaut                                               | MAT-010, UX-005                     | SwipeDeck, qa-swipe ; retiré de l’accueil par USR-11       |
| USR-07    | Sélections préférées à la saisie, dont mobilité                                   | UX-002–003                          | Choices, Select, qa-choices/qa-selects                     |
| USR-08    | Cloche avec comportements simulés                                                 | NOT-005                             | Notifications, notifications.ts et tests                   |
| USR-09    | Talents en tableau paginé                                                         | CON-003                             | TalentsTable et qa-talents-table                           |
| USR-10    | Boutons mobiles immédiats et retour Home                                          | UX-004                              | App et qa-mobile-navigation                                |
| USR-11    | Accueil entreprise recherche + trois boutons + référent ; aucun talent/suggestion | ENT-001–003                         | Home, qa-company-experience                                |
| USR-12    | Besoins avec suivi/alertes, swipe par besoin, modifications dans Besoins          | ENT-004–006                         | Needs/NeedRow/Discovery, needProgress                      |
| USR-13    | Ma sélection résumé + fiche + demande + suggestions distinctes                    | ENT-007–008, REL-006–007            | SelectionSummary, suggestedStudents                        |
| USR-14    | Clôture à mise en relation effectuée                                              | REL-005                             | Request.completed, updateRequestStatus, tests              |
| USR-15    | Notification au conseiller après inscription via invitation                       | ACC-006, NOT-006                    | activatePartner, notification d’inscription, premier appel |
| USR-16    | Répertoire Markdown et actualisation à chaque nouvelle demande                    | GOV-001–007                         | AGENTS.md, JOURNAL.md, contrôle spec:check                 |

| USR-17 | Espace administrateur : formations/plannings/compétences transférés, utilisateurs et entreprises avec coordonnées | ADM-001–008, CON-008, ACC-004 ; administration, calendriers, droits, données | Administrator, CalendarEditor, administration.ts ; copie de travail locale |

| USR-18 | Sur mobile, Plus ouvert ne doit pas laisser Besoins sélectionné | UX-004, AC-UX-007 ; ergonomie, conseiller, recette | App.tsx, tests/e2e/mobile-navigation.spec.ts ; copie de travail USR-18 |

USR-14 traduit la demande de clôture dans un état explicite confirmé par le conseiller ; elle ne signifie pas clôture dès l’envoi d’une demande. Les règles de réouverture restent ouvertes. Les premières demandes évoquant un « espace candidat » n’ajoutent pas de compte étudiant : aucun écran de ce rôle n’existe dans la V1 actuelle.

## Points d’entrée du code et des preuves

| Thème                           | Code existant                                                                                                                     | Validation existante                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Accueil/besoins/sélection/suivi | [Company](../src/components/Company.tsx), [règles entreprise](../src/domain/company-experience.ts)                                | [Parcours entreprise](../scripts/qa-company-experience.js)               |
| Navigation/contexte             | [App](../src/App.tsx), [context](../src/context.tsx)                                                                              | [Navigation tactile](../scripts/qa-mobile-navigation.js)                 |
| Modèle/projections              | [model](../src/domain/model.ts)                                                                                                   | [Tests métier](../tests/domain.test.ts)                                  |
| Profils/CV/coordonnées          | [Modals](../src/components/Modals.tsx), [PersonalDetailsEditor](../src/components/PersonalDetailsEditor.tsx)                      | [Rôles](../scripts/qa-roles.js)                                          |
| Compétences                     | [Skills](../src/components/Skills.tsx), [modèle](../src/domain/skills.ts)                                                         | [Compétences](../scripts/qa-skills.js)                                   |
| Calendriers                     | [éditeur](../src/components/CalendarEditor.tsx), [vues](../src/components/CalendarViews.tsx), [calcul](../src/domain/calendar.ts) | [Calendriers](../scripts/qa-calendars.js)                                |
| Notifications                   | [composant](../src/components/Notifications.tsx), [règles](../src/domain/notifications.ts)                                        | [Notifications](../scripts/qa-notifications.js)                          |
| Pagination                      | [TalentsTable](../src/components/TalentsTable.tsx)                                                                                | [Tableau](../scripts/qa-talents-table.js)                                |
| Sélecteurs                      | [Select](../src/components/Select.tsx), [RolePicker](../src/components/RolePicker.tsx)                                            | [Listes](../scripts/qa-selects.js), [rôle](../scripts/qa-role-picker.js) |
| Swipe                           | [SwipeDeck](../src/components/SwipeDeck.tsx), [règles](../src/domain/swipe.ts)                                                    | [Swipe](../scripts/qa-swipe.js)                                          |

Les [preuves historiques](../docs/VALIDATION.md) précisent ce qui a été exécuté. Un fichier de test présent n’est pas une preuve automatique de réussite.
