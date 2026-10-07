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
