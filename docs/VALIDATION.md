# Vérification de la maquette

Vérification du 7 octobre 2026, sur les données fictives fournies.

## Contrôles

- Compilation TypeScript strict et build Vite : réussis. Génération de `maquette.html` sans dépendance réseau.
- `rtk npm test` : 38 tests métier réussis, incluant les scénarios V3-01 à V3-12.
- Navigateur Playwright MCP : 5 parcours testés à 1 440 px et à 390 px, soit 10 exécutions réussies : confirmation du brief ; fiche expliquée, sélection et demande au conseiller ; héritage du calendrier ; import privé et permis inconnu ; navigation clavier, Échap et restauration du focus.
- Mise en page : 12 vues sur 7 largeurs (320, 360, 390, 600, 768, 1 024 et 1 440 px), soit 84 contrôles sans débordement horizontal.
- Audit axe-core 4.10.3, règles automatisables WCAG 2 A / AA et WCAG 2.1 AA : 12 vues et 3 fenêtres, sur bureau et mobile, soit 30 audits sans violation détectée après correction des contrastes. Résultats conservés dans `accessibility-report.json`.
- Captures bureau et mobile conservées dans ce répertoire.

## Limites

Le sandbox empêche l'écoute d'un serveur local et le lancement de Chromium depuis la CLI. `rtk npm run test:e2e` ne peut donc pas terminer ici. Les parcours équivalents du fichier `scripts/qa-flows.js` sont exécutés via le navigateur MCP disponible, en servant le livrable autonome comme réponse HTTP interceptée. Aucun résultat n'est fabriqué pour la suite CLI.

Les audits automatiques et les essais clavier ne constituent pas une certification WCAG ou RGAA. Les vues ont été testées sur Chromium ; une recette Safari / Firefox et sur téléphones réels restera utile avant production.

Les tests de confidentialité et de cloisonnement concernent les fixtures et le modèle local. L'authentification, les droits API, l'expurgation de vrais PDF, les notifications réelles et le matching IA sont hors de cette maquette.

## Rejouer

```sh
rtk npm run build
rtk npm test
rtk npm run test:e2e
```

En environnement MCP : charger `scripts/qa-preview.local.js` généré par le build, puis `scripts/qa-flows.js` ou `scripts/qa-accessibility.js` avec l'outil navigateur d'exécution de code. Le domaine `glimlink.demo` est intercepté uniquement pour la recette et n'est pas une URL publiée.

## Éditeur et vues de calendrier

Les vues mois, année et l’éditeur avec exception ont été contrôlés à 1 440, 390 et 320 px : navigation des douze mois, détail d’un mois, ajout d’une exception, refus des chevauchements, conservation après rechargement et héritage du conflit de cours par deux profils. `scripts/qa-calendars.js` reproduit ces parcours et les neuf audits axe associés, sans violation détectée (résultats dans `calendar-validation-report.json`). Cinq tests métier supplémentaires couvrent l’alignement des dates, les années bissextiles, les limites d’application et les exceptions sur les rythmes stables ou variables.

## Harmonisation typographique

Après harmonisation des tailles et espacements, les 12 vues ont été revérifiées sur 7 largeurs de 320 à 1 440 px : 84 contrôles sans débordement horizontal. Les 10 parcours généraux et les 3 parcours du calendrier restent valides. Les 30 audits généraux et les 9 audits du calendrier ne détectent aucune violation automatisable. Les captures bureau, conseiller, mobile et calendriers ont été actualisées. Les tailles reposent sur une échelle en rem : texte principal 16 px, détails 14 px, éléments compacts 12 px ; les titres sont adaptés au contexte et à la largeur.

## Données personnelles et rôles

Les tests métier couvrent désormais la projection entreprise sans champs privés, la modification des coordonnées par un conseiller habilité, le refus d’une modification hors rôle ou hors établissement et la conservation des coordonnées lors d’une publication ou correction professionnelle. La recette `scripts/qa-roles.js`, réussie sur bureau et mobile, vérifie les données modifiables, leur persistance après rechargement, leur absence des vues entreprise et de l’aperçu CV, l’ouverture depuis une demande, les contacts adaptés au rôle et la migration d’une ancienne sauvegarde sans perte des corrections.

## Compétences structurées

Cinq tests métier supplémentaires vérifient la migration sans niveau inventé, le refus des doublons, la séparation niveau / état, la conservation de la version publiée après suppression dans le brouillon et l’exclusion de champs annexes de la projection. `scripts/qa-skills.js` vérifie ajout, niveau, doublon, suppression, annulation, proposition de formation, conservation après rechargement et publication aux entreprises à 1 440, 390 et 320 px. Six audits axe du nouvel éditeur et de la fiche entreprise sont sans violation détectée. Les parcours généraux et les parcours de confidentialité ont été rejoués avec succès après migration du modèle.

## Corrections de l’audit des spécifications

- Build TypeScript/Vite et génération de la maquette autonome réussis.
- 34 tests métier réussis, dont six nouveaux scénarios couvrant corrections en attente, périmètre conseiller, isolation entreprise et confidentialité des notes, versions de demande et estimations d’assouplissement sans modification automatique.
- `scripts/qa-audit.js` : dix scénarios à 1 440, 390 et 320 px, soit 30 vérifications de parcours réussies, avec contrôle de débordement des nouvelles vues et fenêtres. Brief corrigé, propositions de compétences/domaines, mobilité, comparaison/publication, validateur, calendrier annuel entreprise, changements depuis demande, périmètres, partenaires distincts, invitation/activation persistante et aide sans résultat.
- `scripts/qa-accessibility.js` : 30 audits automatisés sans violation détectée sur ordinateur et mobile. Les audits automatisés ne constituent pas une certification.
- Neuf audits ciblés supplémentaires (brief éditable, demande renseignée et aide sans résultat) à 1 440, 390 et 320 px, puis deux audits du menu mobile ouvert : aucune violation détectée. Résultats dans `audit-validation-report.json`.
- Navigation mobile : demandes et partenaires accessibles par « Plus », contrôlé à 390 et 320 px sans réduire la taille des libellés.
- Les données déjà enregistrées sont migrées sans réinitialisation ; les anciennes demandes sans référence historique affichent une réserve.
- Le périmètre demeure celui d’une maquette : scores, extraction CV, authentification et e-mails simulés ; décisions §20 conservées comme ouvertes.

## Découverte par swipe

La vue Cartes est le mode par défaut. Les gestes horizontaux déplacent et inclinent la carte, puis sélectionnent à droite ou passent à gauche. Un petit mouvement revient en place ; un mouvement vertical laisse défiler la page. Les profils sélectionnés ou passés quittent la pile. Les boutons, les flèches du clavier, l’annulation de chaque choix et la vue Grille restent disponibles. La consultation des fiches conserve les droits et les champs publics existants.

- 38 tests métier réussis, dont quatre scénarios supplémentaires pour sélection sans doublon, passage réversible, conservation des sélections antérieures et exclusion des profils retirés ou non autorisés.
- `scripts/qa-swipe.js` : gestes à la souris, aperçu de direction, seuil, boutons, clavier, annulation, fin de pile, rechargement, grille et confidentialité à 1 440, 390 et 320 px ; trois audits axe sans violation. Réduction des animations contrôlée.
- Événements tactiles Chromium : glissement à droite, à gauche et défilement vertical vérifiés à 390 et 320 px.
- Les dix parcours généraux ont été rejoués avec succès sur ordinateur et mobile. Les tests de plusieurs profils utilisent explicitement la grille.
- Captures `docs/screenshots/swipe-*.png` et résultats `swipe-validation-report.json`.

## Sélections dans les formulaires — 7 octobre 2026

La mobilité candidat utilise exclusivement une liste : information à vérifier, rayon de 15/30/50 km du domicile, région ou France entière. Le brief entreprise distingue les déplacements locaux, régionaux et nationaux d’un site fixe. Ces choix décrivent une information confirmée, sans ajouter une règle automatique d’éligibilité. Les anciennes valeurs sont conservées comme options existantes, sans conversion approximative.

Les compétences, domaines, secteurs, fonctions et villes proposent des choix. Les listes non exhaustives autorisent un choix personnalisé ; la mobilité ne propose pas cette saisie. Les villes de la maquette sont des suggestions locales, pas un référentiel national. Les domaines et compétences du brief sont repliables et affichent les valeurs sélectionnées. Les descriptions, coordonnées et commentaires restent libres lorsque nécessaire.

Validation : compilation TypeScript et build autonome réussis, 38 tests domaine réussis. `scripts/qa-choices.js` vérifie sélection, ajout d’une compétence, persistance du brouillon, choix multiples, autre ville et absence de débordement à 1440/390/320 px ; aucun problème détecté par axe WCAG A/AA sur ces écrans. Les 30 parcours `qa-audit.js` et les parcours `qa-skills.js` passent également. La séparation brouillon/publication et les permissions entreprise/conseiller sont conservées.

## Ajustements d’affichage mobile — 7 octobre 2026

Correction des libellés tronqués du sélecteur d’espace et du retour à la ligne de « Demandes » dans la navigation. Les champs mobiles utilisent une police de 16 px ; la recherche et les filtres occupent toute la largeur jusqu’à 480 px. Les colonnes des formulaires de fiche passent sur une colonne sur petit écran. Les cartes partenaires alignent leur logo en haut et leurs actions sur toute la largeur. Le décor coupé de la bannière d’accueil est masqué sur téléphone. Les étiquettes « Demandé » du rythme hebdomadaire restent dans leur cellule. L’en-tête et la fermeture des longues fiches ont été vérifiés après défilement.

`qa-mobile.js` vérifie 13 pages et 3 fenêtres à 320×740, 375×812, 390×844, 430×932 et 740×390 pixels : absence de débordement horizontal, champs lisibles, libellés de navigation sur une ligne, recherche pleine largeur et fermeture accessible. La compilation autonome passe. Les 30 contrôles axe de `qa-accessibility.js` (ordinateur et mobile) ne signalent aucune violation sur les écrans testés ; les parcours swipe passent à 1440, 390 et 320 px. Ces contrôles utilisent Chromium avec des tailles de viewport mobiles, sans prétendre remplacer un essai sur un appareil iOS ou Android réel.

## Swipe par défaut sur l’accueil — 7 octobre 2026

L’accueil entreprise présentait encore les profils en grille, alors que la découverte d’un besoin ouvrait déjà le swipe. L’accueil affiche désormais le même composant de swipe et l’ensemble des profils compatibles avec le premier besoin actif. « Swipe » apparaît en premier dans le sélecteur, avec « Grille » comme choix explicite. Le choix de vue de l’accueil est réinitialisé lorsqu’une autre entreprise de démonstration est ouverte. La sélection et son annulation utilisent les mêmes règles métier que la découverte.

`qa-swipe.js` vérifie l’affichage initial de l’accueil, une sélection et son annulation sur l’accueil, l’accès volontaire à la grille, l’ouverture depuis la liste des besoins, le changement de besoin et le retour à l’accueil à 1440/390/320 px, en plus des parcours de glissement existants. Les contrôles `qa-mobile.js` et `qa-accessibility.js` passent également.

## Centre de notifications simulées — 7 octobre 2026

La cloche ouvre une fenêtre de notifications dans les deux espaces existants, Entreprise et Conseiller. Elle affiche le nombre de notifications non lues. Chaque notification peut être lue individuellement ou par « Tout marquer comme lu » ; l’état est conservé dans le stockage local. Ouvrir le profil ou la liste de demandes marque aussi la notification comme lue. Les alertes historiques restent consultables sans révéler un profil devenu inaccessible.

La simulation entreprise ajoute une alerte pour un profil déjà publié et potentiellement compatible avec un besoin actif du compte. La simulation conseiller crée une demande fictive, marquée « Simulation », avec un instantané des données publiées et du brief validé, sans changer les sélections existantes. Lire une demande ne la fait pas passer à l’étape suivante. Les notifications et leur lecture respectent le périmètre entreprise et conseiller ; aucun e-mail n’est envoyé. Un espace candidat distinct n’existe pas dans cette maquette.

Validation : compilation et maquette autonome générée ; 42 tests domaine réussis, dont quatre sur la simulation, les instantanés et l’isolation des états de lecture. `qa-notifications.js` passe à 1440/390/320 px : ouverture de la cloche, événements simulés, compteurs, lecture individuelle/globale, navigation, persistance et changement d’entreprise. Aucun débordement de fenêtre ni violation axe WCAG A/AA détectés sur les fenêtres testées.

## Notification de démonstration visible avec un ancien stockage — 7 octobre 2026

Une session avec des alertes entreprise déjà lues et aucune demande conseiller affichait deux compteurs à zéro, même après rechargement. Une notification de bienvenue explicitement marquée « Simulation » apparaît maintenant dans chaque espace et pour chaque entreprise de démonstration. Elle explique comment tester la cloche, sans créer d’alerte métier ni de demande, et peut être marquée comme lue via « Compris ». Son état est enregistré séparément par compte et rôle. Les anciennes alertes lues, demandes, sélections et corrections ne sont pas réinitialisées.

Validation : build autonome et 44 tests domaine réussis ; les parcours de notifications à 1440/390/320 px passent, sans violations axe. Le scénario ajouté reproduit un ancien stockage avec toutes les alertes lues, aucune demande et aucun état de bienvenue, puis vérifie le badge dans les deux espaces et la persistance après lecture/rechargement.

## Sélecteurs lisibles sur PC et tableau paginé — 7 octobre 2026

La coupure du niveau « Pratique accompagnée » est reproduite dans l’éditeur de compétences sur PC. Un composant `Select` partagé conserve le contrôle natif, ses options, ses valeurs, ses validations et sa navigation clavier/souris, mais affiche le choix complet dans un cadre dont la hauteur s’adapte au texte. Les sélecteurs de rôle, d’entreprise, de formation, de compétences, de filtres, de calendrier et de suivi utilisent ce composant. Les textes longs peuvent passer sur plusieurs lignes et les colonnes ont une largeur minimale nulle pour éviter les recouvrements.

Le vivier conseiller utilise un tableau avec candidat, formation, compétences, statut et action de fiche. La pagination propose 5/10/20 lignes, un compteur de résultats et Précédent/Suivant avec limites désactivées. Recherche et filtres s’appliquent avant pagination et reviennent à la première page. Le tableau devient des lignes empilées avec intitulés de colonnes visibles sur téléphone. Le résumé de talents à vérifier du tableau de bord conserve son format compact.

Validation : build TypeScript/autonome réussi. `qa-selects.js` et `qa-talents-table.js` passent à 1920/1366/1024/390/320 px, y compris textes longs, absence de recouvrement, ouverture native à la souris, choix au clavier, dernière page, recherche, filtres, taille de page, état vide et ouverture d’une fiche. Aucun problème axe WCAG A/AA détecté sur les écrans contrôlés. Les 30 parcours `qa-audit.js` et les parcours compétences passent également après remplacement des sélecteurs.

## Menu de choix d’espace — 7 octobre 2026

Le choix Entreprise/Conseiller de l’en-tête utilise désormais un menu dédié : deux options avec leurs intitulés complets, indication de l’espace courant et position bornée à la fenêtre. Le bouton affiche « Espace entreprise » ou « Espace conseiller » sur PC et un libellé court sur téléphone. Le menu se ferme après sélection, clic extérieur, Tab ou Échap. Il conserve les valeurs de rôle et les routes existantes. Les autres sélecteurs de formulaire restent natifs.

`qa-role-picker.js` passe à 1920×1080, 1366×900, 1024×768, 390×844, 320×740 et 740×390 : options lisibles, limites de fenêtre respectées, sélection à la souris, flèches/Home/End/Entrée, fermeture et restauration du focus, sans violation axe WCAG A/AA sur les écrans testés. Les parcours de bascule d’espace de `qa-flows.js` et le test E2E ont été adaptés au nouveau menu. Les vérifications générales mobiles passent également.

## Menus communs à tous les sélecteurs — 7 octobre 2026

Le composant `Select` affiche un bouton de sélection et une liste dans la couche popover : textes complets sur plusieurs lignes, choix courant coché, liste défilante et position ajustée à la fenêtre, même dans un dialogue. Les valeurs de formulaire et la validation obligatoire restent conservées. Le clavier permet les flèches, Home/End, Entrée/Espace, la recherche par préfixe, Échap et Tab. Le choix courant et les erreurs sont associés au contrôle accessible.

`qa-selects.js` passe à 1920, 1366, 1024, 390 et 320 px : sélection souris et clavier, focus, options longues, menu dans les limites de l’écran et aucune violation axe WCAG A/AA sur les écrans testés. La validation d’un champ obligatoire, la valeur FormData et le choix « Autre… » passent également. Les contrôles de menus sur les pages principales passent aussi à 740×390. Captures : `docs/screenshots/selects-1366.png` et `selects-390.png`.

Validation complémentaire : compilation TypeScript et build, 44 tests métier, 10 parcours de `qa-flows.js`, `qa-choices.js` sur 3 formats, et `qa-mobile.js` sur 5 formats (13 pages et 3 fenêtres par format).

## Navigation tactile et retour à l’accueil — 8 octobre 2026

La navigation principale actualise la vue dès le clic/tap, sans attendre l’événement `hashchange`. L’activation de la destination courante ferme aussi le menu « Plus » et remet la page en haut. Le focus du contenu et le défilement sont appliqués avant l’affichage de la nouvelle vue. Les liens conservent leur URL, les clics avec touches modificatrices et l’historique du navigateur. Les listes de sélection restent au-dessus du menu mobile.

`qa-mobile-navigation.js` passe avec `isMobile: true` et `hasTouch: true` à 320×740, 390×844 et 740×390 dans les deux espaces : appui unique sur chaque onglet, accueil déjà actif après défilement, menu « Plus » et même destination, premier appui avec sélecteur ouvert, historique précédent/suivant. Le test de régression est aussi enregistré dans `tests/e2e/mobile-navigation.spec.ts`. Exécution via navigateur MCP Chromium ; ces essais ne constituent pas une validation sur un iPhone physique ni une exécution de la suite CLI.

Les 10 parcours de `qa-flows.js`, les 13 pages et 3 fenêtres sur 5 formats de `qa-mobile.js`, les menus/formulaires de `qa-selects.js` et la compilation TypeScript/build passent.

## Parcours entreprise recentré — 8 octobre 2026

Accueil sans profils/suggestions, recherche simple conservée au passage au brief, compteurs distincts, suivi et alertes par besoin, swipe dans le besoin, sélection résumée et suggestions excluant les Talent Alerts. La confirmation « Mise en relation effectuée » par le conseiller clôture le besoin et recalcule les compteurs ; l’invitation puis l’activation d’une entreprise produisent une notification d’inscription avec accès au premier appel.

Validation : build TypeScript/Vite et 48 tests métier réussis. `qa-company-experience.js` passe à 1366, 390 et 320 px pour le parcours complet, plus invitation/inscription/premier appel. Axe WCAG A/AA ne rapporte aucune violation sur l’accueil et la sélection testés. `qa-flows.js` (10 parcours), `qa-swipe.js` (3 formats), `qa-mobile.js` (13 pages/3 fenêtres sur 5 formats) et `qa-mobile-navigation.js` (3 formats tactiles/deux espaces) passent via navigateur MCP Chromium. La suite CLI Playwright n’a pas été exécutée dans ce sandbox.

Captures : `company-home-1366.png`, `company-home-390.png`, `company-needs-1366.png`, `company-needs-390.png`, `company-selection-1366.png`, `company-selection-390.png` dans `docs/screenshots/`. Le parcours de swipe de validation a été adapté à son retrait de l’accueil.

## Consolidation documentaire — 8 octobre 2026

Création de `specificaiton/` : 19 fichiers Markdown dont 15 spécifications thématiques, transcription source du PDF, index, matrice de traçabilité et journal. Les 20 sections du PDF, annexes A/B, 124 exigences identifiées et scénarios V3-01 à V3-12 sont couverts. Les décisions de la session et les simulations/écarts de la maquette d6f296f sont distingués des exigences originales. La règle de maintenance à chaque nouvelle demande est inscrite dans AGENTS.md.

`rtk npm run spec:check` passe : métadonnées et dates, 11 rubriques par spécification, index, liens locaux, empreinte PDF, couverture et recette. Relecture de cohérence avec le PDF/code/docs. Aucun changement fonctionnel, aucun rebuild de la maquette ni nouvelle exécution des tests applicatifs pour cette demande documentaire. Les skills create-specification/update-specification de github/awesome-copilot ont été conservés avec leur provenance/licence, le nom exact specifications n’étant pas disponible.


## USR-17 — Espace administrateur (8 octobre 2026)

- Build TypeScript/Vite et génération de `maquette.html` réussis.
- 51 tests métier réussis, dont création des référentiels, héritage du planning, refus des rôles non administrateurs, doublons et projections sans annuaire privé.
- Suite CLI Playwright réellement exécutée : 13 tests réussis, 1 ignoré (scénario mobile sur desktop).
- Parcours MCP sur le fichier autonome : création formation/compétence/planning, utilisateur et entreprise ; conservation après rechargement, rattachement candidat, consultation conseiller, largeurs 1366/390/320, aucun débordement ni erreur JavaScript. Modification d’exception et héritage Sophie/Inès vérifiés.
- `spec:check` réussi : 16 spécifications, 132 exigences ; revue sémantique des droits et arbitrages.
- Captures : [accueil desktop](screenshots/admin-home-1366.png), [accueil mobile](screenshots/admin-home-390.png), [formation desktop](screenshots/admin-formation-1366.png), [formation mobile](screenshots/admin-formation-390.png).

Ajouts locaux uniquement ; création de comptes, authentification, invitations et routage multi-conseillers restent simulés ou ouverts. Voir [spécification administrateur](../specificaiton/spec-design-espace-administrateur.md).
