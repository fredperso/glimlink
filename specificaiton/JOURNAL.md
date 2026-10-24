---
title: 'Journal des demandes et décisions'
date_created: 2026-10-08
last_updated: 2026-10-23
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


## 2026-10-08 — LIV-002 — Autorisation explicite du push sur origin/main

- **Demande** : « force le push sur origin/main » après présentation du commit 729fcc3 et de son périmètre (administration, spécifications, tests et captures).
- **Impact** : Aucun changement fonctionnel ; autorisation explicite de la livraison sur la branche principale.
- **Contexte** : le contrôle automatique a rejeté le premier push faute d’autorisation assez explicite de la branche et du périmètre. Aucun push n’avait été effectué.
- **Décision** : pousser le commit 729fcc3 et cette entrée de journal sur origin/main du dépôt fredperso/glimlink avec --force-with-lease. La récupération des références confirme que 729fcc3 prolonge origin/main : aucun commit distant n’est à supprimer. Les fichiers locaux .serena/ restent exclus.
- **Fichiers / exigences** : JOURNAL.md pour cette demande ; aucune nouvelle exigence fonctionnelle. Le contenu applicatif et les validations de USR-17 sont inchangés.
- **Validation** : lecture du README des spécifications, vérification de l’état Git, fetch origin et comparaison des historiques ; spec:check avant commit. Le résultat du push et l’égalité des références locale/distante sont vérifiés dans la réponse de livraison.


## 2026-10-08 — USR-18 — Sélection mobile Besoins → Plus

- **Demande** : « si j’appuie de Besoins à Plus sur la version mobile alors Besoins reste sélectionné ».
- **Impact** : correction de présentation de la navigation mobile conseiller ; aucun changement de règle métier ni de données.
- **Cause** : le menu ouvert colorait Plus via aria-expanded mais l’onglet de la page courante conservait sa classe active, créant deux sélections visuelles.
- **Décision** : Plus seul sélectionné pendant l’ouverture ; fermeture sans navigation restaure la page courante. Demandes/Entreprises restent représentées par Plus. URL et aria-current décrivent toujours la page réellement affichée.
- **Révision examinée** : travail local USR-18, base publiée 915cbb3.
- **Fichiers / exigences** : App.tsx et maquette générée ; tests/e2e/mobile-navigation.spec.ts ; ergonomie UX-004/AC-UX-007, conseiller, recette, traçabilité et journal.
- **Validation exécutée** : build TypeScript/Vite et régénération maquette.html réussis ; deux tests CLI Playwright mobile réussis, dont la régression à 320/390 px et en paysage 740×390 ; vérification MCP sur la maquette rechargée avec Plus seul sélectionné et URL Besoins conservée ; capture docs/screenshots/mobile-more-selected-390.png ; spec:check et git diff --check réussis. Aucun nouveau test métier requis pour ce changement de présentation.
- **Livraison** : correction préparée pour origin/main dans la continuité de la livraison GitHub autorisée ; résultat du push vérifié dans la réponse finale.


## 2026-10-08 — LIV-003 — Confirmation du push de la correction mobile

- **Demande** : « oui push », en réponse à la demande de confirmation du push du commit 19bd253 sur origin/main.
- **Impact** : Aucun changement fonctionnel ; livraison de la correction USR-18 déjà validée.
- **Contexte / décision** : le contrôle automatique a rejeté le premier push de cette correction, estimant l’autorisation précédente limitée à l’espace administrateur. L’utilisateur confirme explicitement cette nouvelle livraison. Pousser 19bd253 et cette entrée documentaire vers origin/main de fredperso/glimlink, sans forcer ni modifier les commits distants.
- **Fichiers / exigences** : JOURNAL.md pour la confirmation ; aucune nouvelle exigence produit et aucun changement applicatif depuis USR-18.
- **Validation** : lecture de l’index des spécifications, état Git, fetch origin et comparaison des historiques ; spec:check. Les deux tests mobiles et le build de USR-18 restent les preuves applicatives. Le résultat du push et la référence GitHub sont vérifiés dans la réponse finale.


## 2026-10-08 — USR-19 — Tables des matières des spécifications

- **Demande** : « ajoute une table des matières aux spécifications fonctionnelles ».
- **Impact** : navigation documentaire. Aucun changement fonctionnel de l’application ; aucune règle métier, donnée ni interface de maquette modifiée.
- **Décision** : créer TABLE_DES_MATIERES.md avec accès aux 16 documents maintenus et à chacune de leurs 11 rubriques ; ajouter une table locale dans chaque spécification et dans README.md. Conserver les archives PDF et SOURCE_V3.md intactes.
- **Fichiers / exigences** : nouvelle table globale, README, 16 spécifications (versions documentaires incrémentées), TRACEABILITE et JOURNAL. Gouvernance GOV-008/AC-GOV-005 : maintenir les tables en cas de changement de structure. La révision applicative examinée de chaque document est conservée, car le code reste inchangé.
- **Validation exécutée** : spec:check réussi (16 spécifications, 21 fichiers Markdown, 133 exigences) ; 374 liens avec ancres vérifiés, 16 tables locales couvrant chacune 11 rubriques et 176 accès directs dans la table globale ; git diff --check réussi ; archives PDF/SOURCE_V3 inchangées. Pas de tests applicatifs ni de reconstruction exécutés pour cette modification Markdown.


## 2026-10-08 — ANAL-001 — Préparation d’une première version exploitable

- **Demande** : évaluer ce qu’il reste à définir fonctionnellement pour lancer le développement d’une première version exploitable par le centre et les entreprises partenaires.
- **Impact** : Aucun changement fonctionnel ; analyse du cadrage et recommandations, sans approbation de nouvelles règles ni réduction implicite du périmètre PDF.
- **Sources examinées** : README et registre des arbitrages ; accès/droits, administration, candidats/CV, formations/calendriers, matching, notifications, sélections/mises en relation et recette. Guide du recrutement CNIL consulté pour les sujets information, accès et conservation : https://www.cnil.fr/fr/le-guide-du-recrutement.
- **Constat** : parcours principaux définis, mais règles opérationnelles à préciser : gestion des comptes et affectation/remplacement des conseillers ; formation/promotion/calendrier ; publication et actualisation des dossiers ; contraintes et score de matching ; refus/annulation/clôture/réouverture ; routage et livraison des notifications ; traitement et conservation des données personnelles. Les identités, comptes, e-mails, fichiers CV, extraction, matching et stockage partagé restent à réaliser au-delà des simulations.
- **Recommandations à valider** : fixer en priorité les droits/rattachements, le modèle formation/promotion, les champs minimum et la gestion des inconnues, puis les transitions de demandes. Pilote limité à un centre avec plusieurs conseillers et entreprises ; critères de recette de bout en bout avec dossiers représentatifs. Une éventuelle simplification de l’IA, du CV ou des intégrations ne devient pas une décision produit dans cette analyse.
- **Fichiers / exigences** : JOURNAL.md uniquement ; ARB-001 à ARB-014 demeurent ouverts ou partiellement décidés selon leur état actuel. Aucune modification des exigences thématiques ni de la table des matières.
- **Validation exécutée** : revue sémantique des documents mentionnés et comparaison des règles décidées, ouvertes et simulées ; contrôle spec:check. Aucun test applicatif ni build supplémentaire nécessaire pour cette analyse sans modification du code.


## 2026-10-08 — ANAL-002 — Proposition de stack et déploiement cloud simplifié

- **Demande** : proposer une stack facilement déployable dans le cloud avec une expérience click-and-deploy comparable à GitHub Pages, avant de créer les spécifications techniques détaillées.
- **Impact** : Aucun changement fonctionnel ; proposition d’architecture et de fournisseurs à valider. Aucun compte cloud, déploiement, abonnement ou spécification technique détaillée créé.
- **Sources examinées** : README, modèle/contrats de données, arbitrages et package.json ; documentations officielles Vercel (Vite, Git, plans), Supabase (régions, tarifs, fonctions, droits, stockage, SMTP, déploiement) et Brevo (e-mails transactionnels) vérifiées le 8 octobre 2026.
- **Recommandation non approuvée** : réutiliser React/TypeScript/Vite ; héberger l’interface sur Vercel ; Supabase pour PostgreSQL, Auth, stockage privé et fonctions métier TypeScript ; Brevo pour SMTP/notifications. Déploiement interface lié à GitHub et workflow GitHub Actions à préparer pour migrations/fonctions. Régions de données UE précises proposées ; droits et visibilité privée/public restent à développer selon les exigences existantes. Traitements CV lourds à externaliser en tâches asynchrones selon les contraintes des fonctions.
- **Limites explicitées** : configuration initiale de plusieurs services et du domaine d’envoi, pas un bouton qui crée automatiquement toute l’infrastructure. Vercel Pro 20 USD/mois avec un siège de déploiement et Supabase Pro à partir de 25 USD/mois pour un premier projet ; socle indicatif de 45 USD/mois hors taxes, e-mail/IA, usages supplémentaires, sièges ou environnement additionnel. Hobby Vercel réservé à l’usage personnel non commercial. Alternative Render étudiée pour un serveur Node/PostgreSQL avec Blueprint et bouton de déploiement.
- **Fichiers / exigences** : JOURNAL.md uniquement ; aucun fournisseur imposé dans les spécifications fonctionnelles. ARB-011 reste ouvert ; les recommandations ne valent pas validation du choix technique.
- **Validation exécutée** : revue d’adéquation avec les parcours et l’existant, consultation des sources officielles et spec:check. Aucun test applicatif ni build requis pour cette analyse.


## 2026-10-08 — USR-20 — Hébergement souverain européen, préférence française

- **Demande** : « je souhaite un hébergement sur un cloud souverain européen. idéalement en France », en complément de la proposition de stack avant les spécifications techniques détaillées.
- **Impact** : nouvelle contrainte de production ; aucun changement fonctionnel des parcours de la maquette. La souveraineté européenne est demandée ; la France est une préférence.
- **Décision acquise** : PRO-008 formalise la contrainte. ARB-011 demeure partiellement ouvert pour le fournisseur, les garanties contractuelles, le périmètre des dépendances et une éventuelle qualification SecNumCloud. Aucune qualification spécifique n’est imposée par interprétation. La proposition ANAL-002 est à revoir : une région française chez un opérateur non européen ne démontre pas la souveraineté demandée.
- **Recommandation non approuvée** : Clever Cloud en France, avec React/TypeScript/Vite conservé, serveur Node.js/TypeScript, PostgreSQL de production, stockage privé Cellar compatible S3 et identité Keycloak disponible comme service. Proposition d’e-mails via Scaleway Transactional Email en région Paris ; IA à choisir après vérification des flux et garanties d’hébergement. Scaleway Serverless Containers est une alternative nécessitant une chaîne de construction/déploiement à préparer. Aucun compte cloud, abonnement ou déploiement créé ; aucune spécification technique détaillée rédigée.
- **Sources officielles examinées le 8 octobre 2026** : Clever Cloud (souveraineté, intégration GitHub, runtime Node.js, PostgreSQL, Cellar, Keycloak), Scaleway (Serverless Containers, API Transactional Email en fr-par), ANSSI (FAQ et périmètre de qualification SecNumCloud). Clever Cloud indique une qualification en cours sur son infrastructure propre, ce qui ne vaut pas qualification acquise de la stack proposée.
- **Liens de référence** : https://www.clever.cloud/sovereign-cloud/ ; https://www.clever.cloud/developers/doc/tools/github/ ; https://www.clever.cloud/developers/doc/deploy/databases/postgresql/ ; https://www.clever.cloud/developers/doc/deploy/storage/cellar/ ; https://www.clever.cloud/developers/doc/deploy/services/keycloak/ ; https://www.scaleway.com/en/developers/api/transactional-email ; https://cyber.gouv.fr/enjeux-technologiques/cloud/faq-qualification-secnumcloud/.
- **Fichiers / exigences** : vision produit PRO-008/AC-PRO-004 ; arbitrages ARB-011/AC-ARB-005 ; README, TRACEABILITE et JOURNAL. Versions documentaires incrémentées ; révision applicative examinée conservée. Structure et tables des matières inchangées. PDF et SOURCE_V3 restent des archives.
- **Validation exécutée** : revue de cohérence entre contrainte explicite, préférences et recommandations non approuvées ; spec:check réussi (16 spécifications, 21 fichiers Markdown, 134 exigences) et git diff --check réussi. Aucun test applicatif ni build exécuté pour cette évolution documentaire sans changement du code.


## 2026-10-08 — ANAL-003 — Réutilisation du compte Scaleway existant

- **Demande** : l’utilisateur possède déjà un compte Scaleway et demande s’il peut le réutiliser pour Glimlink.
- **Impact** : Aucun changement fonctionnel ; réponse de faisabilité et recommandation technique ajustée à un compte existant. PRO-008 reste applicable ; aucun fournisseur ni ensemble de services n’est approuvé par cette question.
- **Recommandation non approuvée** : privilégier désormais Scaleway pour éviter un second fournisseur principal, avec projet Glimlink dédié dans le compte existant ; React/TypeScript/Vite et API Node.js/TypeScript réunis dans un conteneur sur Serverless Containers, PostgreSQL managé via Private Network, CV dans Object Storage privé et notifications via Transactional Email. Choisir Paris/fr-par pour les services proposés et vérifier la localisation des sauvegardes et journaux. L’authentification des utilisateurs et les autorisations métier restent à développer ; IAM Scaleway administre les ressources cloud. L’IA et le périmètre de souveraineté restent à valider.
- **Déploiement proposé** : préparer Dockerfile et workflow GitHub Actions pour tester, construire l’image, la publier dans Container Registry Scaleway et déployer via API/CLI ; prévoir migrations et configuration initiale. Le lancement manuel du workflow ou un push sur la branche choisie pourra déclencher cette chaîne une fois réalisée. Ce n’est pas une intégration déjà installée ni un bouton créant automatiquement tous les services.
- **Sources officielles vérifiées** : disponibilité Paris des services, documentation/API Serverless Containers, Managed Databases, réseau privé, Object Storage et Transactional Email. Références : https://www.scaleway.com/fr/product-availability-by-region/ ; https://www.scaleway.com/en/developers/api/serverless-containers ; https://www.scaleway.com/en/docs/tutorials/metabase-postgre-containers-private-networks/ ; https://www.scaleway.com/en/docs/managed-databases-for-postgresql-and-mysql/concepts/ ; https://www.scaleway.com/en/docs/object-storage/how-to/create-a-bucket/ ; https://www.scaleway.com/en/developers/api/transactional-email.
- **Fichiers / exigences** : JOURNAL.md uniquement ; ARB-011 reste ouvert pour le choix final et le périmètre. La proposition Clever Cloud de USR-20 conserve son statut historique non approuvé ; Scaleway devient la recommandation actuelle. Aucun accès au compte, création de ressources, achat, déploiement ou spécification technique détaillée effectué.
- **Validation exécutée** : revue documentaire et vérification des sources officielles ; aucun test applicatif ni build, car le code ne change pas.


## 2026-10-22 — OPS-001 — Publication de la maquette sur GitHub Pages

- **Demande** : cloner le dépôt, installer les dépendances, puis mettre à jour les pages publiées sur https://fredperso.github.io/glimlink/.
- **Impact** : Aucun changement fonctionnel ; opération de publication. GitHub Pages servait l’`index.html` source de Vite, qui ne s’exécute pas sans build : la page en ligne était blanche.
- **Décision technique** : workflow `.github/workflows/pages.yml` déclenché à chaque push sur `main` (et manuellement) : `npm ci`, `npm run build`, publication de la maquette autonome `maquette.html` comme `index.html`. Source GitHub Pages basculée de « branche main » vers « GitHub Actions ».
- **Fichiers / exigences** : workflow et JOURNAL.md ; aucune exigence modifiée.
- **Validation exécutée** : build local réussi ; premier déploiement GitHub Actions réussi ; la page en ligne contient le script de la maquette.


## 2026-10-22 — USR-21 — Ergonomie et look and feel inspirés des sites de rencontre

- **Demande** : améliorer l’ergonomie et surtout le look and feel d’une application de rencontre entre entreprises et candidats à l’alternance, en s’appuyant sur les sites de rencontre. Choix confirmés : palette chaude (corail → orange) ; refonte de tout l’habillage et du parcours swipe.
- **Impact** : présentation des trois espaces et parcours de découverte entreprise. Aucune règle métier, donnée ni droit modifié. La sélection n’est pas présentée comme un accord mutuel : l’écran « rejoint votre sélection » rappelle que rien n’est envoyé et que le conseiller organise la rencontre.
- **Réalisation** : jetons de couleur chauds et dégradés ; neutres teintés de vert convertis vers des teintes chaudes à luminosité égale ; couleurs de disponibilité, de compétences et d’états OK conservées. Cartes de profil immersives (dégradé par avatar, identité en surimpression, pastille de compatibilité). Swipe : carte plus grande, tampons « Je retiens / Je passe », boutons ronds Annuler / Passer / Sélectionner / Fiche complète, collants sur mobile, dialogue natif de « match ». Accueil entreprise avec pile de cartes décorative ; navigation, onglets et boutons en pilule ; filtres de découverte défilants sur mobile.
- **Décisions / questions ouvertes** : palette, formes et écran de match sont des choix de maquette validés dans leur principe par l’utilisateur ; le libellé et la fréquence de l’écran de match restent à confirmer en recette utilisateur.
- **Fichiers / exigences** : UX-009–011, AC-UX-008–010 (ergonomie) ; ENT-010, AC-ENT-008 (entreprise) ; TRACEABILITE, README, JOURNAL ; docs/DESIGN.md. Code : `src/styles.css` (jetons), `src/rencontre.css`, `src/swipe.css`, `SwipeDeck.tsx`, `TalentCard.tsx`, `Company.tsx`, `ui.tsx` et couleurs des autres feuilles.
- **Validation exécutée** : build et TypeScript réussis ; `npm test` 51 tests réussis ; Playwright CLI 16 tests réussis et 2 ignorés (desktop + mobile), dont le nouveau test du parcours de match ; contrastes des jetons calculés (≥ 4,5:1) ; captures desktop 1440 px et iPhone 13 revues. Pas d’essai sur appareil physique ni d’audit axe.


## 2026-10-22 — USR-22 — Swipe mobile fluide et pendant ordinateur

- **Demande** : réaméliorer le swipe, « hyper fluide » sur mobile, avec un équivalent sur le web qui ne soit pas forcément du swipe mais très facile à utiliser et dans l’air du temps ; puis pousser sur GitHub.
- **Impact** : présentation et interaction de la découverte entreprise. Règles de sélection, de passage, d’annulation et de visibilité inchangées (`applySwipe` / `undoSwipe`).
- **Réalisation** : moteur de geste hors React (transform via requestAnimationFrame, vitesse lissée, seuil adaptatif, rotation selon le point de saisie, retour ressort, envol par Web Animations, retour haptique Android) ; cartes suivantes réellement affichées dans le paquet ; carte plein écran avec compétences en pastilles ; barre de progression façon stories ; retour animé d’une carte annulée. Ordinateur : fiche bento à tuiles, file d’attente cliquable, plateau « Ma sélection » vers lequel la carte s’envole, raccourcis clavier globaux et touches affichées. L’écran de match n’interrompt plus que la première sélection ; les suivantes affichent un cœur animé.
- **Décisions / questions ouvertes** : choix de maquette : seuil, raccourcis, file cliquable (change l’ordre de présentation, pas le classement) et match unique par session ; à confirmer en recette utilisateur. Pas de tirage vers le haut pour la fiche sur téléphone.
- **Fichiers / exigences** : UX-012–013, AC-UX-011–012 ; ENT-010 et AC-ENT-008 précisés ; TRACEABILITE, JOURNAL. Code : `SwipeDeck.tsx` (DeckCard, MatchDialog), `swipe.css`, `TalentCard.tsx` (variante paquet retirée), tests E2E.
- **Validation exécutée** : TypeScript et build réussis ; `npm test` 51 réussis ; Playwright CLI 18 réussis et 2 ignorés (ordinateur + iPhone 13), dont deux tests du swipe (match, annulation, raccourcis, match unique) ; gestes simulés à 390 px (ressort à 60 px, glissé long, geste rapide de 45 px, annulation, aucune mutation DOM pendant le geste) ; captures 1440 px et iPhone 13 revues ; spec:check réussi. Pas d’essai sur appareil physique (fluidité réelle, haptique iOS non disponible).


## 2026-10-23 — ANAL-004 — Nouveautés du PDF V6 visuel par rapport aux spécifications

- **Demande** : identifier les nouveautés de `Glimlink_Specifications_Fonctionnelles_Detaillees_V6_Visuelle-1.pdf` (21 octobre 2026, 9 pages, maquettes incluses) par rapport aux spécifications existantes.
- **Impact** : Aucun changement fonctionnel à ce stade ; analyse comparative. Le PDF V6 n’est pas encore intégré comme référence : ni archive textuelle, ni exigence modifiée. Les V4 et V5 citées par ses maquettes ne sont pas disponibles dans le dépôt.
- **Constats principaux** : plus aucun score ni pourcentage visible (contredit MAT-006, ENT-005 et la maquette actuelle) ; découverte réduite à Découvrir / Grille-Tous les profils / Ma sélection sur le même vivier, sans rejet automatique (contredit les onglets et le seuil de 60 %) ; « À découvrir » remplacé par un Déclic Glimlink ponctuel qui ne déplace pas un profil plus proche ; « Passer » n’est pas un refus et le profil reste dans la grille (la maquette masque les profils passés) ; brief enrichi (intitulé IA, au moins 3 missions, lieu obligatoire prérempli multi-sites, Alternance/CPRO ou Stage, niveaux Bac+2/3/5, langue, disponibilité immédiate ou prochaine rentrée) ; calendrier utilisé seulement si une contrainte est exprimée puis confirmée ; carte et fiche personnalisées (pourquoi ce profil, faits saillants, en lien avec vos missions, CV anonymisé, onglet calendrier) ; relais humain et alerte conseiller en cas de non-sélection ; observations conseiller et signal « pépite » invisibles ; routage du besoin vers le conseiller de la formation/niveau ; hiérarchie Organisation → Campus → Écoles/Marques → Formations → Talents ; nouveaux hors-périmètres (CDI, RQTH, soft skills inventées) et nouvelle liste d’arbitrages et de priorités.
- **Décisions / questions ouvertes** : intégration de la V6 comme nouvelle référence, sort des assouplissements calculés de la V3 (§9, non repris en V6), maintien des avatars géométriques et de la palette USR-21 face aux maquettes V6 (violet/rose, sans avatar), entrée « Mon profil » et place de « Mises en relation » dans la navigation entreprise.
- **Fichiers / exigences** : JOURNAL.md uniquement.
- **Validation exécutée** : lecture intégrale du PDF V6 (texte et pages, surlignages compris) ; comparaison avec SOURCE_V3, les spécifications thématiques (matching, entreprise, arbitrages) et le code (NeedBuilder, Company, SwipeDeck) ; spec:check. Aucun test applicatif, car le code ne change pas.


## 2026-10-23 — ANAL-005 — Architecture de production orientée sécurité

- **Demande** : proposer une architecture logicielle facilement déployable, avec un langage et un framework laissant le moins de place possible aux failles de sécurité ; faible volumétrie ; LLM pour l’analyse des CV et éventuellement un LLM dédié aux comptes rendus.
- **Impact** : Aucun changement fonctionnel ; proposition d’architecture non approuvée. PRO-008 (cloud souverain, préférence France) reste la contrainte ; ARB-007 (CV), ARB-009 (qualification réglementaire IA) et ARB-011 (exploitation) restent ouverts.
- **Recommandation non approuvée** : remplace la proposition Node.js/TypeScript d’ANAL-003 pour le serveur. Monolithe Django (Python, version LTS) avec django-ninja pour l’API et django-allauth (codes par e-mail, MFA/passkeys obligatoires pour conseillers et administrateurs), sessions serveur en cookies HttpOnly, sans JWT ; interface React/TypeScript/Vite conservée, servie depuis la même origine. Autorisations centralisées côté serveur, avec lecture entreprise limitée à l’instantané publié et PostgreSQL Row-Level Security comme seconde barrière. Worker séparé pour l’analyse des CV et la génération des comptes rendus, sorties LLM validées par un schéma et soumises à la validation du conseiller. Déploiement Scaleway fr-par : Serverless Containers (web et worker) sur Private Network, PostgreSQL managé, Object Storage privé, Transactional Email, Secret Manager et Generative APIs. Chaîne GitHub Actions avec dépendances verrouillées, analyses de vulnérabilités et image minimale. Les règles de `src/domain` et les tests V3-01 à V3-12 sont à porter côté serveur.
- **Décisions / questions ouvertes** : choix Django ou alternative TypeScript ; modèle LLM et minimisation des données transmises ; recours à RLS ; tests d’intrusion avant mise en production ; qualification AI Act de l’usage recrutement (ARB-009).
- **Sources vérifiées** : https://www.scaleway.com/en/docs/generative-apis/reference-content/data-privacy/ ; https://www.scaleway.com/en/docs/serverless-containers/reference-content/containers-private-networks/.
- **Fichiers / exigences** : JOURNAL.md uniquement ; aucune exigence modifiée.
- **Validation exécutée** : revue des arbitrages, des propositions ANAL-002/USR-20/ANAL-003 et des sources ci-dessus ; spec:check. Aucun test applicatif ni build, car le code ne change pas.


## 2026-10-23 — USR-23 — Intégration du PDF V6 visuel et affinage avec « Questions V1 »

- **Demande** : « intègre la V6 et adapte la maquette. Affine aussi avec ce fichier : Questions V1.docx ».
- **Impact** : changement fonctionnel majeur de la découverte entreprise et du brief, ajouts conseiller ; nouvelle source archivée. La V6 prévaut sur la V3 lorsqu’elles diffèrent. « Questions V1 » ne contient que des questions et des recommandations : il enrichit les arbitrages sans créer de règle.
- **Réalisation maquette** : aucun score ni pourcentage visible (carte, file, fiche) ; découverte en trois espaces (Découvrir, Tous les profils, Ma sélection) sur le même vivier ordonné par une pertinence interne ; passer ≠ refuser (profils passés visibles et resélectionnables, « Revoir les profils passés ») ; carte V6 (pourquoi ce profil, faits saillants, en lien avec vos missions, Déclic Glimlink) ; fiche à onglets Vue d’ensemble / CV anonymisé / Calendrier ; reformulation « Est-ce que j’ai bien compris ? » (intitulé, 3 missions minimum éditables, compétences déduites, lieu prérempli depuis les sites, Alternance/CPRO ou Stage, formation suggérée, niveaux Bac+2/3/5, permis, langue, disponibilité immédiate/prochaine rentrée) ; calendrier ignoré sans présence obligatoire écrite et confirmée ; relais humain (entreprise → alerte conseiller avec pistes) ; observations factuelles et signal interne « à valoriser » ; premier besoin préparé à l’invitation ; Mon profil multi-sites ; navigation entreprise Vue d’ensemble, Mes besoins, Découvrir, Ma sélection, Talent Alerts, Mon profil (Plus sur mobile).
- **Décisions de maquette à confirmer** : relais déclenché à la demande de l’entreprise (seuil automatique ouvert, ARB-015) ; assouplissements V3 réservés au conseiller (ARB-020) ; niveau déduit de l’intitulé de formation ; pondérations −25/−8/+3 illustratives ; palette corail USR-21 conservée malgré les maquettes V6 violet/rose (texte V6 faisant foi) ; avatars géométriques conservés comme visuels non identifiants ; « Mises en relation » accessible depuis Ma sélection et Plus.
- **Questions V1 intégrées** : comptes et réaffectation (ARB-005), formation/promotion et calendrier (ARB-002), dossiers et doublons (ARB-001), matching et jeu de cas évalués (ARB-004, ARB-012), demandes et clôture (ARB-006), notifications (ARB-010), CV et confidentialité (ARB-007, ARB-008), distinction entre règle définie et service à développer (arbitrages §1).
- **Fichiers / exigences** : SOURCE_V6 (nouveau) ; MAT-001–016 et AC-MAT-007–010 ; ENT-005, ENT-009, ENT-011–017 et AC-ENT-009–013 ; CON-009–012 ; NOT-009–010 ; PRO-009–011 ; ACC-007–008 ; FIC-008–009 ; DAT-004, DAT-008 ; REL-009–010 ; ADM-009 ; GOV-009 ; REC-007 ; UX-010, UX-013 ; ARB-001–020 ; README, TRACEABILITE (couverture V6), TABLE_DES_MATIERES, JOURNAL ; contrôle `spec:check` étendu à l’empreinte V6 ; AGENTS.md, README racine, docs/DESIGN.md. Code : `brief.ts`, `reading.ts`, `model.ts`, `partners.ts`, `fixtures.ts`, `notifications.ts`, `NeedBuilder`, `ValidatedBrief`, `Company`, `SwipeDeck`, `TalentCard`, `Modals`, `Adviser`, `AdviserRelay`, `App`, styles.
- **Validation exécutée** : TypeScript et build réussis ; `npm test` 59 réussis dont 8 tests V6 ; Playwright CLI 22 réussis et 2 ignorés (ordinateur + iPhone 13), dont les nouveaux parcours V6 (reformulation, passer ≠ refuser et relais, Mon profil multi-sites, CV anonymisé) ; gestes simulés du swipe toujours conformes (aucune mutation DOM pendant le geste) ; captures ordinateur et mobile revues ; spec:check réussi avec l’empreinte V6. Lecture du document « Questions V1 » (texte extrait). Pas d’essai sur appareil physique ; aucun moteur IA ni service réel.


## 2026-10-23 — ANAL-006 — Architecture Java et front sans framework lourd, MFA/FIDO2

- **Demande** : écarter Django au profit d’un back en Java et d’un front avec framework ou, si cela suffit, Bootstrap seul ; intégrer le MFA dans l’application, « peut-être le DNA2 », interprété comme FIDO2 (passkeys/WebAuthn) et à confirmer.
- **Impact** : Aucun changement fonctionnel ; proposition d’architecture non approuvée qui remplace celle d’ANAL-005. PRO-008, ARB-007, ARB-009 et ARB-011 restent applicables et ouverts.
- **Recommandation non approuvée** : Java 25 LTS, Spring Boot 4.1 et Spring Security 7.1, avec MFA natif et passkeys FIDO2 obligatoires pour conseillers et administrateurs ; lien de connexion à usage unique par e-mail pour les entreprises, passkey proposée. Pages rendues côté serveur avec Thymeleaf, Bootstrap 5 et htmx, sans SPA. Le moteur de geste du swipe, déjà indépendant de React, est porté en JavaScript natif. Persistance PostgreSQL avec Flyway et accès de l’entreprise limité à l’instantané publié, plus Row-Level Security. Worker Java (PDFBox, Spring AI branché sur Scaleway Generative APIs) avec sorties validées et soumises au conseiller. Même cible Scaleway fr-par qu’ANAL-005, image construite avec Jib. Les règles de `src/domain` et les tests V3-01 à V3-12 sont à porter en Java/JUnit ; la maquette React reste une maquette.
- **Décisions / questions ouvertes** : confirmation de « DNA2 » = FIDO2 ; MFA pour les entreprises ; procédure de récupération d’accès ; facteur de secours (TOTP non natif dans Spring Security, à vérifier) ; démarrage à froid des conteneurs serverless (instance minimale ou image native).
- **Sources vérifiées** : https://docs.spring.io/spring-security/reference/7.1/servlet/authentication/mfa.html ; https://docs.spring.io/spring-security/reference/7.0/servlet/authentication/passkeys.html ; https://www.herodevs.com/blog-posts/spring-boot-versions-eol-dates-and-latest-releases-april-2026.
- **Fichiers / exigences** : JOURNAL.md uniquement ; aucune exigence modifiée.
- **Validation exécutée** : revue documentaire et des sources ci-dessus ; spec:check. Aucun test applicatif ni build, car le code ne change pas.


## 2026-10-23 — USR-24 — Spécification technique : Java, front Bootstrap, MFA FIDO2

- **Demande** : « oui c’est bien FIDO2, rédige la spécification technique », à la suite de la demande d’un back Java, d’un front sans framework si Bootstrap suffit et d’une MFA intégrée à l’application.
- **Impact** : nouvelle exigence d’accès (MFA FIDO2) et nouvelle spécification technique ; aucun parcours ni règle métier de la maquette modifié, aucun code changé.
- **Décisions acquises** : back Java ; front sans framework JavaScript applicatif ; MFA intégrée ; FIDO2 (ACC-009). Spring Boot 4.1 / Spring Security 7.1, Thymeleaf + Bootstrap 5.3 + htmx 2, PostgreSQL avec RLS, worker IA Spring AI sur Scaleway Generative APIs, Scaleway fr-par et la chaîne de livraison restent des choix « Conception » à valider en revue technique.
- **Questions ouvertes** : ARB-021 créé (MFA obligatoire pour les entreprises, passkeys synchronisées ou clés matérielles pour les administrateurs, récupération d’accès, durées d’invitation et de session) ; CV anonymisé généré depuis la version publiée plutôt qu’expurgé (ARB-007) ; chiffrement applicatif des coordonnées ; ARB-008, ARB-009 et ARB-011 inchangés.
- **Fichiers / exigences** : nouveau `spec-architecture-technique.md` (ARC, AUT, AUZ, PER, FCH, IAG, FRT, INF, LIV, EXP, AC-ARC-001–018) ; accès-droits ACC-009, AC-ACC-007 et §8 ; arbitrages ARB-021 et §8 ; gouvernance AC-GOV-005 (17 spécifications) ; README, TABLE_DES_MATIERES, TRACEABILITE, JOURNAL.
- **Validation exécutée** : relecture des spécifications d’accès, de données, de CV, d’arbitrages et de la V6 (§2, §14, §15, §18, §21, §22) ; vérification des sources Spring Security (MFA, passkeys), Spring Boot et Scaleway citées dans ANAL-005/ANAL-006 ; spec:check. Aucun test applicatif ni build, car le code ne change pas ; aucune API Spring n’a été compilée.


## 2026-10-23 — USR-25 — Fluidité du défilement des fiches candidat

- **Demande** : « le scroll sur la fiche candidat semble un peu lent. Est-ce qu’il y a des façons d’optimiser cette maquette sur ce point ? »
- **Impact** : présentation uniquement ; aucune règle métier modifiée.
- **Diagnostic mesuré** : défilement de la fiche entreprise et de la fiche conseiller avec un processeur ralenti 4 fois, variantes CSS comparées. Le flou d’arrière-plan des fenêtres (`backdrop-filter: blur(4px)`) était la seule cause : 23 images/s et 48 images lentes sur 83 pour la fiche conseiller sur ordinateur, 44 images/s pour la fiche entreprise ; sans ce flou, 60 images/s. L’ombre, le masquage du contenu hors écran, le style, la mise en page et le script n’avaient pas d’effet notable. Sur mobile, la fiche occupe tout l’écran et le flou coûtait peu. La barre d’actions floutée du swipe n’a pas d’impact mesurable (59 images/s avec ou sans).
- **Réalisation** : voile `#2b1d2c8c` sans flou derrière les fenêtres (`src/styles.css`).
- **Fichiers / exigences** : UX-014, AC-UX-013 ; JOURNAL.
- **Validation exécutée** : mesure après correction : 60 images/s sur les deux fiches (ordinateur et iPhone 13 émulé), aucune image lente sur ordinateur ; `npm test` 59 réussis ; Playwright 22 réussis et 2 ignorés ; capture revue ; spec:check. Mesures en Chromium sans tête : un essai sur appareil réel reste utile.


## 2026-10-24 — USR-27 — Variante de déploiement Docker Compose

- **Demande** : « imaginer aussi une architecture basée sur un déploiement avec Docker. Je ne sais pas si Scaleway le fait, mais en tout cas, ce serait le plus simple, je pense. »
- **Impact** : Aucun changement fonctionnel ; ajout d’une variante d’hébergement dans la spécification technique. Scaleway exécute des images Docker de deux manières : conteneurs serverless (variante A, déjà décrite) ou instance avec Docker Compose (variante B, ajoutée).
- **Proposition non approuvée** : variante B avec une instance Debian fr-par sans donnée métier ; Compose avec `proxy` (Caddy), `web`, `worker` et `migrate` ; PostgreSQL managé et Object Storage conservés ; groupe de sécurité limité à 80/443 et à SSH depuis l’administration ; conteneurs non root, en lecture seule, sans capacités ; images figées par empreinte ; secrets Compose issus de Secret Manager ; déploiement par SSH à commande forcée avec retour arrière ; reconstruction par OpenTofu et cloud-init ; même `compose.yaml` en local avec PostgreSQL et Mailpit.
- **Décisions / questions ouvertes** : choix A ou B (ARB-011) ; dimensionnement de l’instance ; objectif de reconstruction (4 heures proposées) ; interruption de quelques secondes au déploiement.
- **Fichiers / exigences** : architecture technique v1.1 (§1, §3.8, nouveau §3.11 DCK-001–013, §4, §5 AC-ARC-019–023, §6, §7, §8, §9, §10) ; arbitrages ARB-011 ; TRACEABILITE ; JOURNAL.
- **Validation exécutée** : revue de cohérence avec les exigences communes (AUT, AUZ, LIV, EXP) et PRO-008 ; spec:check. Aucun test applicatif ni build, car le code ne change pas ; l’extrait `compose.yaml` n’a pas été exécuté.
- **Note** : entrée créée sous le numéro USR-25, renumérotée USR-27 car USR-25 et USR-26 avaient été attribués en parallèle à des demandes d’ergonomie.


## 2026-10-24 — USR-28 — Variante B retenue et hébergement des données Scaleway

- **Demande** : « on part sur la variante B, commite tout ça. explique-moi par contre ce que propose Scaleway pour l’hébergement des données. »
- **Impact** : décision d’hébergement ; aucun changement fonctionnel des parcours ni du code.
- **Décision acquise** : variante B, Docker Compose sur une instance Scaleway fr-par, retenue ; la variante A reste documentée comme alternative. Le fournisseur reste soumis à AC-ARB-005 (garanties contractuelles, sous-traitants, SecNumCloud).
- **Précisions ajoutées** : DCK-014 (PostgreSQL managé : accès privé, chiffrement au repos activé à la création, sauvegardes quotidiennes 14 jours, haute disponibilité optionnelle, exports chiffrés par l’application) ; DCK-015 (Object Storage Standard Multi-AZ, SSE-ONE, versionnage, bucket d’exports sans droit de suppression).
- **Questions ouvertes** : haute disponibilité de la base selon le coût ; disponibilité de SSE-KMS et du verrouillage d’objets ; qualification SecNumCloud de Scaleway toujours annoncée « en cours » (à vérifier sur le catalogue ANSSI).
- **Sources vérifiées** : https://www.scaleway.com/en/docs/managed-databases-for-postgresql-and-mysql/concepts/ ; https://www.scaleway.com/en/docs/object-storage/faq/ ; https://www.scaleway.com/en/docs/object-storage/how-to/enable-sse-one/ ; https://www.scaleway.com/en/blog/secnumcloud-qualification-trusted-cloud/.
- **Fichiers / exigences** : architecture technique v1.2 (§1, §3.8, §3.11, EXP-003, lots, §7, §10) ; arbitrages ARB-011 ; TRACEABILITE ; JOURNAL.
- **Validation exécutée** : spec:check ; revue des sources ci-dessus. Aucun test applicatif ni build, car le code ne change pas.


## 2026-10-24 — ANAL-007 — Rester chez OVHcloud plutôt que Scaleway ?

- **Demande** : l’utilisateur a déjà un compte OVH et y a acheté le nom de domaine ; il demande s’il serait plus simple de rester chez cet hébergeur.
- **Impact** : Aucun changement fonctionnel ; analyse comparative. La variante B (USR-28) et Scaleway restent la référence de la spécification technique tant qu’aucun changement de fournisseur n’est décidé.
- **Constats** : le nom de domaine n’impose pas l’hébergeur (DNS pointable vers tout fournisseur). La variante B est transposable chez OVHcloud : instance Public Cloud, Public Cloud Databases PostgreSQL (chiffrement LUKS des volumes et des sauvegardes, réseau privé vRack, pas de clé fournie par le client), Object Storage S3, AI Endpoints (Gravelines, données ni conservées ni partagées selon OVHcloud). Écart principal : pas de service d’e-mail transactionnel identifié chez OVHcloud, donc un sous-traitant d’envoi supplémentaire. OVHcloud annonce le 1er septembre 2026 la qualification SecNumCloud de son offre SNC Cloud Platform ; Scaleway reste « en cours ».
- **Recommandation non approuvée** : OVHcloud est un choix cohérent (un seul fournisseur, trajectoire SecNumCloud plus avancée) ; décision attendue avant toute modification de DCK-001, DCK-014, DCK-015, INF-005 et IAG-002.
- **Sources vérifiées** : https://docs.ovhcloud.com/fr/guides/public-cloud/databases/concepts-security-overview ; https://docs.ovhcloud.com/fr/guides/public-cloud/ai-machine-learning/ai-endpoints-capabilities ; https://corporate.ovhcloud.com/en/newsroom/news/ovhcloud-obtains-secnumcloud-qualification-snc-cloud-platform/.
- **Fichiers / exigences** : JOURNAL.md uniquement.
- **Validation exécutée** : revue des sources ci-dessus ; spec:check. Aucun test applicatif ni build, car le code ne change pas.


## 2026-10-24 — USR-30 — Hébergement OVHcloud et e-mails Brevo

- **Demande** : « ok on part sur OVH avec Brevo, adapte la spec et commite ».
- **Impact** : décision de fournisseur ; aucun changement fonctionnel des parcours ni du code.
- **Décision acquise** : variante B (USR-28) hébergée chez OVHcloud, où se trouvent déjà le compte et le nom de domaine ; e-mails transactionnels par Brevo. La variante A reste décrite pour Scaleway comme alternative historique.
- **Adaptations** : instance Public Cloud en région Paris 3-AZ (Gravelines à défaut, choix au lot 0) ; vRack ; Public Cloud Databases for PostgreSQL (volumes et sauvegardes chiffrés par le service, sans clé client) ; Object Storage S3 3-AZ avec chiffrement, versionnage et Object Lock pour les exports ; Secret Manager ; Managed Private Registry ; Logs Data Platform ; OpenTofu (fournisseurs OVH et OpenStack) ; AI Endpoints (Gravelines) ; DNS et DNSSEC chez OVHcloud ; API Brevo depuis un sous-domaine authentifié SPF/DKIM/DMARC.
- **Questions ouvertes** : région exacte selon la disponibilité de Public Cloud Databases ; rétention des sauvegardes selon l’offre ; haute disponibilité de la base ; exception PRO-008 liée à l’infrastructure Google Cloud déclarée par Brevo (DCK-016, à vérifier dans son DPA et sa liste de sous-traitants) ; l’offre Public Cloud standard n’est pas l’offre SecNumCloud SNC Cloud Platform.
- **Sources vérifiées** : https://docs.ovhcloud.com/fr/guides/public-cloud/databases/concepts-security-overview ; https://docs.ovhcloud.com/fr/guides/public-cloud/ai-machine-learning/ai-endpoints-capabilities ; https://docs.ovhcloud.com/en/guides/account-and-service-management/reversibility/object-storage-3az-reversibility-policy ; https://blog.ovhcloud.com/en/posts/discover-the-external-secret-operator-eso-ovhcloud-provider-to-manage-your-kubernetes-secrets/ ; https://corporate.ovhcloud.com/en/newsroom/news/ovhcloud-obtains-secnumcloud-qualification-snc-cloud-platform/ ; https://www.brevo.com/fr/securite/ ; https://www.brevo.com/fr/blog/conversation-avec-les-experts-partie-1/.
- **Fichiers / exigences** : architecture technique v1.3 (statut, §1, IAG-002, §3.8, INF-004–007, EXP-002, §3.11 DCK-001, DCK-003–004, DCK-006–007, DCK-010–011, DCK-014–015, nouveau DCK-016, §4, §7, §8, §11) ; arbitrages ARB-011 et §8 ; TRACEABILITE ; JOURNAL.
- **Validation exécutée** : spec:check ; recherche des mentions Scaleway restantes (uniquement la variante A historique). Aucun test applicatif ni build, car le code ne change pas.


## 2026-10-24 — OPS-002 — Achat des ressources OVHcloud depuis la console

- **Demande** : acheter, depuis la console OVHcloud ouverte dans Chrome, les éléments nécessaires à l’hébergement (variante B, USR-30).
- **Impact** : Aucun changement fonctionnel ; opération sur le compte du fournisseur.
- **Constat** : la console ne contient encore aucun projet Public Cloud (page d’accueil de création, avec acceptation des conditions contractuelles). Aucune action effectuée : ni acceptation de conditions, ni création, ni achat.
- **Questions ouvertes** : accord explicite sur l’acceptation des conditions Public Cloud et sur le périmètre à créer maintenant ; recommandation de ne créer que le projet et de provisionner le reste par OpenTofu au lot 0 (DCK-010), pour ne pas payer de ressources inutilisées pendant le développement.
- **Fichiers / exigences** : JOURNAL.md uniquement.
- **Validation exécutée** : consultation en lecture seule de la console OVHcloud ; spec:check.


## 2026-10-24 — OPS-003 — Nom de domaine de l’application

- **Demande** : glimlink.com (déjà acheté) portera le site institutionnel ; acheter glimlink.io pour l’application.
- **Impact** : Aucun changement fonctionnel à ce stade ; aucun achat effectué.
- **Constat** (console OVHcloud, 24 octobre 2026) : glimlink.io est déjà réservé par un tiers (seul un transfert est proposé). Disponibles : glimlink.app à 8,49 € HT la première année puis 18,09 € HT/an ; glimlink.eu à 7,49 € HT puis 8,59 € HT/an. Option sans achat : sous-domaine `app.glimlink.com`.
- **Questions ouvertes** : choix du domaine de l’application avant toute mise en production, car les passkeys FIDO2 sont liées au domaine (RP ID, AUT-007) ; un changement ultérieur imposerait de réenregistrer toutes les passkeys. Mise à jour d’INF-004 et d’AUT-007 après décision.
- **Fichiers / exigences** : JOURNAL.md uniquement.
- **Validation exécutée** : recherche de disponibilité dans le tunnel de commande OVHcloud, sans ajout au panier ; spec:check.


## 2026-10-24 — OPS-004 — Titulaire et date d’achat de glimlink.io

- **Demande** : savoir quand et par qui glimlink.io a été acheté.
- **Impact** : Aucun changement fonctionnel ; consultation WHOIS publique.
- **Constat** : création le 13 août 2025 chez Namecheap ; titulaire masqué par un service de confidentialité (Withheld for Privacy), pays déclaré Allemagne (NRW) ; expiration le 13 août 2026 non renouvelée ; statut `redemptionPeriod` depuis le 24 septembre 2026 ; aucun site publié. Libération estimée vers la fin octobre 2026 si le titulaire ne le restaure pas (estimation fondée sur les délais usuels, non garantie).
- **Fichiers / exigences** : JOURNAL.md uniquement.
- **Complément** : glimlink.fr est libre (aucun enregistrement au WHOIS de l’AFNIC) ; prix OVHcloud 4,99 € HT la première année, puis 7,79 € HT/an. Aucun achat effectué.
- **Validation exécutée** : `whois` (registre whois.nic.io) et whois.nic.fr, résolution DNS, tunnel de commande OVHcloud sans ajout au panier ; spec:check.


## 2026-10-24 — OPS-005 — Commande du domaine glimlink.fr

- **Demande** : acheter glimlink.fr seul, pour l’application ; l’utilisateur a confirmé le prix (5,99 € TTC la première année, 1 an, DNSSEC inclus) et les engagements de la commande.
- **Impact** : Aucun changement fonctionnel ; achat chez le registraire.
- **Réalisé** : panier composé de glimlink.fr (1 an au lieu des 3 ans présélectionnés) et DNSSEC inclus ; compte e-mail Zimbra, DNS Anycast et hébergement web refusés ; titulaire, contacts et facturation laissés au profil OVHcloud de l’utilisateur ; paiement par défaut PayPal. Trois des quatre engagements cochés.
- **Non réalisé** : l’engagement personnel d’exactitude des coordonnées du titulaire et le paiement, bloqués par le contrôle d’autorisation de l’outil ; l’utilisateur termine lui-même dans l’onglet ouvert. Le domaine n’est pas acheté tant que le paiement n’est pas validé.
- **Suite** : après achat, mettre à jour INF-004 et AUT-007 (domaine de l’application glimlink.fr, site institutionnel glimlink.com).
- **Fichiers / exigences** : JOURNAL.md uniquement.
- **Validation exécutée** : récapitulatif OVHcloud vérifié (4,99 € HT, 1,00 € de TVA, 5,99 € TTC) ; spec:check.


## 2026-10-24 — USR-31 — Application sur app.glimlink.com et achat de l’hébergement

- **Demande** : « on utilisera app.glimlink.com pour l’hébergement dans un premier temps. occupe toi d’acheter le nécessaire pour l’hébergement ».
- **Impact** : décision de domaine ; aucun changement fonctionnel des parcours ni du code.
- **Décision acquise** : application sur `app.glimlink.com`, site institutionnel sur `glimlink.com`. RP ID WebAuthn = `app.glimlink.com` (AUT-007) ; un changement de domaine ultérieur imposera de réenregistrer les passkeys. La commande glimlink.fr (OPS-005) reste en attente de l’utilisateur.
- **Prix relevés le 24 octobre 2026** (page tarifaire OVHcloud, HT, facturation à l’heure) : instance b3-8 (2 vCore, 8 Go) 0,0512 €/h, environ 37,4 €/mois (31,77 €/mois avec engagement 12 mois) ; d2-8 (Discovery) 0,0372 €/h ; PostgreSQL Essential DB1-4 (1 nœud, 4 Go, 80 Gio) environ 54,46 €/mois ; Business DB1-4 (2 nœuds) environ 138,55 €/mois ; Managed Private Registry S environ 17,30 €/mois ; Object Storage 3-AZ Standard 0,0139941 €/Go/mois. Crédit de 200 € annoncé pour un premier projet Public Cloud.
- **Questions ouvertes** : périmètre à créer maintenant (recette seule ou production) ; registre OVHcloud ou GitHub Container Registry ; acceptation des conditions Public Cloud par l’utilisateur. Aucun achat ni création effectués.
- **Fichiers / exigences** : architecture technique v1.4 (INF-004, AUT-007) ; TRACEABILITE ; JOURNAL.
- **Validation exécutée** : consultation de la page tarifaire OVHcloud ; spec:check. Aucun test applicatif ni build.


## 2026-10-24 — OPS-006 — Création du projet Public Cloud de recette

- **Demande** : « ok recette seule avec GitHub Container Registry, j’accepte les conditions ».
- **Impact** : Aucun changement fonctionnel ; opération chez le fournisseur. Choix de GitHub Container Registry pour la recette, à reporter dans DCK-006 (aujourd’hui : registre OVHcloud).
- **Réalisé** : conditions contractuelles Public Cloud acceptées au nom de l’utilisateur, qui l’a autorisé explicitement ; projet créé en mode découverte (nom par défaut « Project 2026-10-24 », renommage possible seulement après activation).
- **Activation** : bloquée une première fois par le contrôle d’autorisation de l’outil, puis réalisée sur instruction explicite de l’utilisateur (« active-le toi-même ») avec le PayPal par défaut ; projet renommé `glimlink-recette`. La console signale des quotas proches du maximum, à vérifier avant la création de l’instance.
- **Non réalisé** : instance, stockage et enregistrement DNS restent à créer.
- **Fichiers / exigences** : JOURNAL.md uniquement.
- **Validation exécutée** : contrôle visuel de la console OVHcloud ; spec:check.


## 2026-10-24 — OPS-007 — Ressources de la recette : serveur, stockage, DNS

- **Demande** : « lance les trois étapes » (serveur, stockage des CV, enregistrement DNS de la recette).
- **Impact** : Aucun changement fonctionnel ; opération chez le fournisseur.
- **Serveur** : formulaire complété sans validation : `glimlink-recette-01`, b3-8, Paris EU-WEST-PAR (3-AZ), Debian 13 UEFI, clé SSH publique `fred-macbook-ed25519`, sauvegarde automatique désactivée, réseau privé créé par défaut, IP publique simple. Prix affiché : 0,0612 € HT/h, environ 44,67 € HT/mois (instance 0,0512 € + disque local 50 Go 0,0073 € + IP publique 0,0027 €), au lieu des 37,40 € HT annoncés pour l’instance seule : nouvelle confirmation demandée.
- **Stockage** : conteneur `glimlink-recette-cv` préparé (API S3, Paris 3-AZ, versionnage activé, chiffrement SSE-OMK, réplication et Object Lock désactivés) mais non créé : OVHcloud exige de rattacher un utilisateur OpenStack, dont la création génère des identifiants que l’utilisateur doit créer et conserver lui-même.
- **DNS** : en attente de l’adresse IP du serveur.
- **Suite** (confirmation « oui je confirme, lance le serveur ») : serveur `glimlink-recette-01` créé et actif (eu-west-par-b, IP publique 57.130.88.180, IP privée 10.1.3.226, port SSH joignable) ; enregistrement A `recette.app.glimlink.com` → 57.130.88.180 ajouté dans la zone OVHcloud de glimlink.com et vérifié par `dig`. Le formulaire du conteneur de stockage a été refermé : l’utilisateur le crée avec son utilisateur technique.
- **Fichiers / exigences** : JOURNAL.md uniquement.
- **Validation exécutée** : contrôle visuel des formulaires OVHcloud ; spec:check.


## 2026-10-24 — USR-32 — Recette seule et GitHub Container Registry

- **Demande** : « ok recette seule avec GitHub Container Registry, j’accepte les conditions ».
- **Impact** : décision d’hébergement de la recette ; aucun changement fonctionnel.
- **Décision acquise** : seul l’environnement de recette est créé pour l’instant, avec PostgreSQL en conteneur (DCK-003) ; les images de recette sont publiées sur GitHub Container Registry, paquet privé ; le registre OVHcloud reste prévu pour la production (DCK-006).
- **Fichiers / exigences** : architecture technique v1.5 (DCK-006) ; TRACEABILITE ; JOURNAL.
- **Validation exécutée** : spec:check.


## 2026-10-24 — OPS-008 — Script de durcissement du serveur de recette et commande glimlink.fr

- **Demandes** : « prépare le script de durcissement du serveur » ; puis « commande glimlink.fr aussi ».
- **Impact** : Aucun changement fonctionnel ; outillage d’exploitation conforme à DCK-004, DCK-005 et DCK-009, sans modification d’exigence.
- **Réalisé** : `infra/recette/durcissement.sh` (mise à jour, mises à jour de sécurité automatiques avec redémarrage à 04:00 UTC, SSH par clé uniquement et limité à `debian`, pare-feu nftables dans une table dédiée qui préserve les règles Docker : 80/443 publics, SSH limité à `ADMIN_CIDRS`, paramètres noyau sans couper le routage nécessaire à Docker, Docker officiel avec vérification de l’empreinte de clé, journaux limités, `no-new-privileges`, `live-restore`) et `infra/recette/README.md`. Script non exécuté sur le serveur.
- **glimlink.fr** : la case d’engagement sur l’exactitude des coordonnées du titulaire est de nouveau bloquée par le contrôle d’autorisation de l’outil ; l’utilisateur la coche et paie lui-même (5,99 € TTC).
- **Fichiers / exigences** : `infra/recette/` ; JOURNAL.md.
- **Validation exécutée** : `bash -n` ; test local de la génération des règles SSH (IPv4 et IPv6) ; spec:check. Pas de shellcheck disponible ; aucun essai sur le serveur.


## 2026-10-24 — OPS-009 — Exécution du durcissement sur le serveur de recette

- **Demande** : « demandé glimlink.fr, peux-tu lancer le script de durcissement ? », puis « c’est fait, lance le durcissement » après chargement de la clé SSH dans l’agent par l’utilisateur.
- **Impact** : Aucun changement fonctionnel ; exploitation de la recette.
- **Réalisé** : script exécuté avec `ADMIN_CIDRS` réduit à l’adresse IP publique de l’utilisateur, relevée côté serveur (non consignée ici) ; Docker 29.9.2 et Docker Compose v5.6.1 installés. Corrections ajoutées au script puis seconde exécution réussie (idempotence) : démarrage effectif du service nftables, désactivation de LLMNR et mDNS. Redémarrage pour le nouveau noyau (6.12.113+deb13-cloud-amd64).
- **Vérifié après redémarrage** : nftables, docker, unattended-upgrades et ssh actifs ; politique d’entrée `drop`, SSH limité à l’adresse d’administration, 80/443 ouverts ; seuls SSH (22) et le résolveur local (127.0.0.53/54) écoutent ; depuis l’extérieur, 22 ouvert et 80, 443, 2375, 5432, 8080 fermés ; connexions par mot de passe et en root refusées ; `sshd -T` conforme (clé uniquement, `AllowUsers debian`).
- **glimlink.fr** : commandé par l’utilisateur ; WHOIS AFNIC : actif chez OVH, créé le 24 octobre 2026, expiration le 24 octobre 2027.
- **Fichiers / exigences** : `infra/recette/durcissement.sh` ; JOURNAL.md.
- **Validation exécutée** : contrôles ci-dessus ; spec:check.
