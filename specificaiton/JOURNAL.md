---
title: 'Journal des demandes et décisions'
date_created: 2026-10-08
last_updated: 2026-10-08
---

# Journal des demandes et décisions

À partir de cette consolidation, **chaque nouvelle demande utilisateur est consignée**. Mettre à jour les exigences thématiques et la recette si le comportement change ; sinon noter « Aucun changement fonctionnel » et expliquer pourquoi. Les faits historiques regroupés ci-dessous servent de point de départ, sans inventer une date pour chaque ancien message.

## 2026-10-08 — SPEC-001 — Création des spécifications Markdown

- **Demande** : créer `specificaiton/`, utiliser un skill de spécification, reprendre le PDF V3, enrichir avec la maquette et inscrire une règle de mise à jour à chaque nouvelle demande.
- **Impact** : documentation et gouvernance ; aucun changement fonctionnel de la maquette.
- **Sources examinées** : PDF 13 pages/20 sections/annexes A et B, code, docs historiques et session ; état applicatif d6f296f.
- **Décisions** : conserver l’orthographe demandée ; référence thématique consolidée, archive source séparée, exigences identifiées, simulations/arbitrages explicites et critères de recette.
- **Skills** : exact `specifications` non trouvé ; équivalents `create-specification` et `update-specification` récupérés du dépôt GitHub awesome-copilot et conservés dans tools/skills.
- **Fichiers** : index, 15 spécifications thématiques, archive source, traçabilité et ce journal ; règle AGENTS.md ; commande de vérification documentaire et liens depuis README/docs.
- **Validation** : contrôle structure/liens/sources/couverture de `rtk npm run spec:check` ; relecture de cohérence PDF–décisions–code. Les 48 tests métier et essais MCP indiqués dans la recette sont les preuves de l’état applicatif précédent, pas de nouveaux essais de cette demande documentaire.
- **Restant ouvert** : décisions du §20 et limites de production conservées dans le registre d’arbitrages.

## Situation reprise de la session — état d6f296f

- Accès entreprise/conseiller, Mathilde JEANNE, partenaires fictifs et cloisonnement des comptes.
- Fiches et coordonnées privées corrigibles par conseiller ; brouillon/publication séparés.
- Compétences structurées avec niveau, acquis/en acquisition et lien formation.
- Calendrier partagé, édition des rythmes/exceptions, vues mois/année et couleurs sémantiques.
- Swipe par besoin, tableaux de talents paginés, listes de choix complètes et navigation mobile réactive.
- Cloche simulée, lecture des événements et inscription entreprise signalée au référent pour un premier appel.
- Dernière évolution entreprise : accueil sans talents, recherche et trois compteurs, besoins suivis/alertes propres, sélection résumée/suggestions distinctes, clôture à relation confirmée.
- Questions sur token, push, cache et hébergement : aucun nouveau comportement fonctionnel requis ; le partage/publication de la démo ne constitue pas une authentification sécurisée.

Voir [TRACEABILITE.md](TRACEABILITE.md) pour les décisions et leurs règles.

## Modèle pour la prochaine entrée

Pour la date et un identifiant unique, consigner : demande ; sources/impact ; décisions prises ou arbitrages ouverts ; fichiers/exigences et critères mis à jour ; vérifications réellement exécutées ; limites ; livraison éventuelle. Une question de statut utilise la mention « Aucun changement fonctionnel » avec sa justification.


## 2026-10-08 — USR-17 — Ajout de l’espace administrateur

- **Demande** : ajouter un espace administrateur à la maquette ; permettre l’ajout d’une formation avec son planning et ses compétences, transférer ces fonctions depuis le conseiller, ajouter utilisateurs et entreprises avec leurs coordonnées.
- **Impact** : troisième rôle, navigation desktop/mobile, catalogue et édition des formations/plannings, annuaires utilisateurs/entreprises et persistance locale ; consultation/rattachement candidat conservés côté conseiller.
- **Décisions explicites** : administration des formations/plannings confiée à l’administrateur ; ajout d’utilisateurs et d’entreprises dans cet espace. Aucun compte étudiant introduit.
- **Choix illustratifs / ouverts** : rôles proposés admin/conseiller/entreprise ; coordonnées complètes requises pour les ajouts, SIRET facultatif dans la préparation du partenaire, deux membres d’équipe fictifs et campus sélectionnable. Entreprise créée `invited` sans événement d’inscription. Matrice multi-campus, délégations, routage des nouveaux conseillers et véritables comptes restent ouverts (§20/ARB-005). L’équipe ajoutée constitue un annuaire, sans authentification réelle.
- **Révision examinée** : copie de travail locale USR-17, base historique d6f296f ; modifications préexistantes préservées, aucun commit/publication effectué.
- **Réalisation** : Administrator, CalendarEditor/CalendarsPage, App/RolePicker, guide et accès conseiller, modèle ManagedUser et administration.ts, projections sans annuaire privé, styles admin et maquette.html générée. Recettes existantes d’édition transférées au rôle admin.
- **Spécifications** : nouvelle spec-design-espace-administrateur (ADM-001–008, AC-ADM-001–006) ; actualisation espace conseiller (CON-008), calendriers, compétences, droits (ACC-004), produit, données, arbitrages (ARB-005), recette, README, TRACEABILITE et couverture documentaire.
- **Validation exécutée** : build TypeScript/Vite et génération autonome ; 51 tests métier réussis ; suite Playwright CLI réellement exécutée, 13 réussis et 1 ignoré (scénario mobile sur desktop). Parcours MCP sur maquette autonome locale : trois ajouts à 1366/390/320 pixels, persistance après rechargement, sélection d’une nouvelle formation dans la fiche candidat, consultation conseiller, absence de débordement et d’erreur JavaScript. Édition admin d’une exception datée : persistance et conflit hérité par Sophie/Inès vérifiés. Contrôle `spec:check` réussi (16 spécifications, 132 exigences). Revue sémantique des rôles, comptes simulés et §20 effectuée.
- **Captures** : docs/screenshots/admin-home-1366.png, admin-home-390.png, admin-formation-1366.png et admin-formation-390.png. Stockage de recette navigateur nettoyé après essai.


## 2026-10-08 — STAT-001 — Statut du push GitHub

- **Demande** : « as tu poussé sur github ? »
- **Impact** : Aucun changement fonctionnel ; question sur la livraison Git de la maquette.
- **Constat** : aucun commit ni push effectué lors de l’ajout de l’espace administrateur ; fichiers modifiés et nouveaux fichiers toujours locaux. Dernier commit local : afa2638, « Add Glimlink V1 interactive prototype ». Origin configuré vers fredperso/glimlink sur GitHub.
- **Décision** : répondre sur l’opération effectuée ; cette question ne déclenche pas de publication.
- **Fichiers / exigences** : JOURNAL.md uniquement ; aucune exigence produit modifiée.
- **Validation exécutée** : lecture de l’index des spécifications, git status --short, git remote -v et git log -1 ; contrôle documentaire spec:check. Aucune interrogation réseau ni nouvelle recette applicative nécessaire pour constater l’absence de commit/push de cette livraison.


## 2026-10-08 — LIV-001 — Push GitHub demandé

- **Demande** : « pousse » ; publier sur GitHub la livraison locale comprenant l’espace administrateur.
- **Impact** : Aucun changement fonctionnel ; opération de livraison des évolutions documentées par USR-17.
- **Décisions** : livrer sur `origin/main` du dépôt fredperso/glimlink, sans push forcé ; conserver les commits distants existants. Les fichiers locaux `.serena/` restent exclus du commit.
- **Préparation** : récupération des références distantes et comparaison du contenu indexé à origin/main. La branche locale était en retard de 13 commits déjà représentés dans les fichiers de travail ; réalignement avec conservation de l’index et de tous les fichiers, puis commit de la seule différence à livrer.
- **Fichiers / exigences** : JOURNAL.md pour cette opération ; code, maquette générée, tests, captures et spécifications de USR-17 inclus dans la livraison. Aucune exigence produit supplémentaire.
- **Validation** : contrôle documentaire spec:check et contrôle des différences Git avant commit ; les preuves applicatives restent les 51 tests métier et 13 tests Playwright réussis (1 ignoré) de USR-17. Le résultat du push et la référence du commit sont vérifiés et rapportés dans la réponse de livraison.
