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
