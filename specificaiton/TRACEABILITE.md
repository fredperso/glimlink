---
title: 'Traçabilité PDF, demandes et maquette'
date_created: 2026-10-08
last_updated: 2026-10-24
---

# Traçabilité

Le PDF V3 est archivé dans [SOURCE_V3.md](SOURCE_V3.md) et le PDF V6 visuel du 21 octobre 2026 dans [SOURCE_V6.md](SOURCE_V6.md) ; la V6 prévaut lorsqu’elle diffère (USR-23). Les décisions ci-dessous proviennent de la session utilisateur jusqu’au 23 octobre 2026. La preuve applicative examinée est la révision d6f296f ; les dates exactes des demandes anciennes ne sont pas réinventées.

## Couverture des sections et annexes

| PDF | Sujet                           | Document consolidé                                            | Situation                                                                                     |
| --- | ------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 1   | Vision et limites               | [Spécification](spec-design-produit.md)                       | Cadrage conservé ; accueil simplifié sans changer la promesse                                 |
| 2   | Acteurs et rôles                | [Spécification](spec-process-acces-droits.md)                 | Entreprise/conseiller/admin (USR-17) ; aucun compte étudiant ; données privées modifiables dans le périmètre |
| 3   | Invitation et compte entreprise | [Spécification](spec-process-acces-droits.md)                 | Activation et référent simulés ; inscription notifiée                                         |
| 4   | Besoin naturel                  | [Spécification](spec-process-besoins-matching.md)             | Champ accueil conservé au formulaire ; confirmation explicite                                 |
| 5   | Matching                        | [Spécification](spec-process-besoins-matching.md)             | Contrôles structurés ; pertinence interne sans score visible (V6) ; IA simulée ; critères à arbitrer |
| 6   | Calendrier partagé              | [Spécification](spec-data-formations-calendriers.md)          | Héritage, exceptions datées, vues mois/année ; pas de demi-journées                           |
| 7   | Swipe et profil                 | [Spécification](spec-design-ergonomie-mobile.md)              | Swipe dans Besoins, grille explicite ; confidentialité de la fiche publiée                    |
| 8   | À découvrir                     | [Spécification](spec-process-besoins-matching.md)             | Remplacé par le Déclic Glimlink (V6 §8) : passerelle justifiée, jamais avant un profil plus proche |
| 9   | Absence de match                | [Spécification](spec-process-besoins-matching.md)             | Remplacé par le relais humain (V6 §11) ; pistes d’assouplissement réservées au conseiller (ARB-020) |
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

| USR-19 | Ajouter une table des matières aux spécifications fonctionnelles | GOV-008, AC-GOV-005 ; index et 16 documents thématiques | TABLE_DES_MATIERES.md et tables locales ; évolution documentaire |

| USR-20 | Cloud souverain européen, de préférence en France | PRO-008, AC-PRO-004, ARB-011, AC-ARB-005 ; vision produit et arbitrages | Contrainte de production acquise ; fournisseur et niveau de qualification non approuvés |

| USR-21 | Ergonomie et look and feel inspirés des sites de rencontre | UX-009–011, AC-UX-008–010, ENT-010, AC-ENT-008 ; ergonomie, entreprise | rencontre.css, swipe.css, SwipeDeck (MatchDialog), TalentCard ; test E2E Swipe |

| USR-22 | Swipe mobile hyper fluide et équivalent ordinateur sans geste | UX-012–013, AC-UX-011–012, ENT-010, AC-ENT-008 ; ergonomie, entreprise | SwipeDeck (moteur de geste, DeckCard bento, file, plateau, raccourcis), swipe.css ; tests E2E Swipe |

| USR-23 | Intégrer le PDF V6 visuel, adapter la maquette et affiner avec « Questions V1 » | SOURCE_V6 ; MAT-001–016, ENT-005, ENT-009, ENT-011–017, CON-009–012, NOT-009–010, PRO-009–011, ACC-007–008, FIC-008–009, DAT-008, REL-009–010, ADM-009, GOV-009, REC-007, ARB-001–020 | brief.ts, reading.ts, model.ts (relevance, discoveryOrder, requestAdviserHelp), NeedBuilder, Company, SwipeDeck, TalentCard, Modals, AdviserRelay ; tests V6 |

| USR-24 | Back Java, front sans framework JavaScript (Bootstrap), MFA intégrée, FIDO2 ; rédiger la spécification technique | ACC-009, AC-ACC-007, ARB-021 ; ARC-001–007, AUT-001–011, AUZ-001–006, PER-001–007, FCH-001–004, IAG-001–009, FRT-001–007, INF-001–007, LIV-001–005, EXP-001–006, AC-ARC-001–018 | spec-architecture-technique.md ; proposition technique non réalisée, choix « Conception » à valider en revue |

| USR-25 | Le défilement de la fiche candidat semble lent | UX-014, AC-UX-013 ; ergonomie | styles.css (voile sans flou derrière les fenêtres) ; mesure d’images/s |

| USR-26 | Éviter le long défilement des fiches en popin (onglets ou autre) | UX-015, AC-UX-014, ENT-014, AC-ENT-014, CON-013, AC-CON-009 ; ergonomie, entreprise, conseiller | SheetTabs, Modals (Profile, StudentEditor), ui.tsx (Modal `sheet`), rencontre.css ; test E2E UX-015 |

| USR-29 | Replier le formulaire d’ajout dans la rubrique Compétences | CMP-009, AC-CMP-006 ; compétences | Skills.tsx (bouton dépliable), skills.css ; test E2E UX-015 |

| USR-27 | Imaginer aussi une architecture de déploiement Docker, jugée la plus simple | DCK-001–013, AC-ARC-019–023, ARB-011 ; architecture technique, arbitrages | spec-architecture-technique.md §3.11 ; variante B proposée, choix A/B ouvert |

| USR-28 | Retenir la variante B (Docker Compose sur une instance) | DCK-001–015, AC-ARC-019–023, ARB-011 ; architecture technique, arbitrages | spec-architecture-technique.md v1.2 ; décision d’hébergement, aucune infrastructure créée |

| USR-30 | Héberger chez OVHcloud (compte et domaine existants) avec Brevo pour les e-mails | IAG-002, INF-004–007, EXP-002, DCK-001, DCK-003–004, DCK-006–007, DCK-010–011, DCK-014–016, ARB-011 ; architecture technique, arbitrages | spec-architecture-technique.md v1.3 ; décision de fournisseur, aucune infrastructure créée |

| USR-31 | Servir l’application sur app.glimlink.com dans un premier temps | INF-004, AUT-007 ; architecture technique | spec-architecture-technique.md v1.4 ; enregistrement DNS à créer avec l’instance |

| USR-32 | Recette seule, images Docker sur GitHub Container Registry | DCK-006 ; architecture technique | spec-architecture-technique.md v1.5 ; projet glimlink-recette et serveur glimlink-recette-01 créés (OPS-006, OPS-007) |

USR-14 traduit la demande de clôture dans un état explicite confirmé par le conseiller ; elle ne signifie pas clôture dès l’envoi d’une demande. Les règles de réouverture restent ouvertes. Les premières demandes évoquant un « espace candidat » n’ajoutent pas de compte étudiant : aucun écran de ce rôle n’existe dans la V1 actuelle.

## Couverture du PDF V6

| V6  | Sujet                                   | Documents consolidés                                                                                         | Situation dans la maquette |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------ | -------------------------- |
| 1   | Vision, IA sans score, aucune photo     | [Produit](spec-design-produit.md) PRO-009–010                                                                | Aucun pourcentage ; avatars géométriques non identifiants |
| 2   | Architecture et droits                  | [Accès](spec-process-acces-droits.md) ACC-007–008, [Entreprise](spec-design-espace-entreprise.md) ENT-015, [Admin](spec-design-espace-administrateur.md) ADM-009 | Navigation entreprise V6 ; hiérarchie et marques à réaliser |
| 3   | Accès, profil, multi-sites              | [Entreprise](spec-design-espace-entreprise.md) ENT-016, [Conseiller](spec-design-espace-conseiller.md) CON-011 | Mon profil multi-sites ; premier besoin préparé par le conseiller |
| 4-5 | Phrase libre et reformulation           | [Besoins](spec-process-besoins-matching.md) MAT-001–003, MAT-011, MAT-015–016                                 | Règles lisibles simulant l’IA ; 3 missions minimum |
| 6   | Règle calendrier                        | [Besoins](spec-process-besoins-matching.md) MAT-012                                                           | Calendrier ignoré sans présence obligatoire |
| 7   | Ordre de présentation                   | [Besoins](spec-process-besoins-matching.md) MAT-006, MAT-013                                                  | Pertinence interne fictive ; aucun rejet |
| 8   | Lecture personnalisée et Déclic         | [Besoins](spec-process-besoins-matching.md) MAT-008, MAT-014                                                  | Lecture déterministe à partir de la fiche validée |
| 9   | Découverte, carte, fiche                | [Entreprise](spec-design-espace-entreprise.md) ENT-011–014, [CV](spec-data-candidats-cv.md) FIC-008             | Trois espaces, passer ≠ refuser, CV anonymisé fictif |
| 10-11 | Sélection et relais humain            | [Sélections](spec-process-selections-mises-en-relation.md) REL-009–010, [Notifications](spec-process-notifications.md) NOT-009 | Relais à la demande de l’entreprise ; seuil ouvert (ARB-015) |
| 12  | Talent Alerts                           | [Notifications](spec-process-notifications.md) NOT-010                                                        | Inchangé ; e-mail simulé |
| 13-17 | Parcours conseiller                   | [Conseiller](spec-design-espace-conseiller.md) CON-009–012                                                   | Observations, signal interne, relais ; routage à réaliser (ARB-019) |
| 18  | Cycle de vie étudiant                   | [Fiches/CV](spec-data-candidats-cv.md) FIC-005                                                                | Inchangé ; RGPD ouvert (ARB-008) |
| 19  | Synthèse des règles                     | Documents ci-dessus                                                                                           | Chaque règle reliée à une exigence |
| 20  | Hors périmètre                          | [Produit](spec-design-produit.md) PRO-011, [Entreprise](spec-design-espace-entreprise.md) ENT-017              | Aucune rubrique Pépite visible |
| 21  | Points à arbitrer                       | [Arbitrages](spec-process-arbitrages.md) ARB-004, 005, 007, 008, 015–019                                      | Ouverts |
| 22  | Priorités de développement              | [Arbitrages](spec-process-arbitrages.md)                                                                      | Ordre indicatif ; services réels à développer |

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
| Reformulation, lecture, relais (V6) | [brief](../src/domain/brief.ts), [lecture](../src/domain/reading.ts), [relais](../src/components/AdviserRelay.tsx), [NeedBuilder](../src/components/NeedBuilder.tsx) | [Tests métier](../tests/domain.test.ts), [parcours](../tests/e2e/prototype.spec.ts) |

Les [preuves historiques](../docs/VALIDATION.md) précisent ce qui a été exécuté. Un fichier de test présent n’est pas une preuve automatique de réussite.
