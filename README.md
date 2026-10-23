# Glimlink — maquette interactive V1

Maquette React, HTML et TypeScript basée sur les spécifications détaillées V3. V3 est la révision du document ; le produit représenté est la V1.

## Ouvrir

Ouvrez **`maquette.html` directement dans un navigateur moderne**. Le fichier contient tous les scripts, styles et illustrations et fonctionne sans serveur ni CDN.

Le sélecteur en haut permet de passer de l'espace entreprise à l'espace conseiller. Le guide en bas de page propose les parcours et la réinitialisation. Les modifications sont conservées dans le stockage local du navigateur, lorsqu'il est disponible.

## Développer et vérifier

Prérequis : Node.js 24 et npm ; Python 3 pour le contrôle documentaire `spec:check`.

```sh
rtk npm ci
rtk npm run dev
rtk npm run build
rtk npm test
rtk npm run test:e2e
rtk npm run spec:check
```

Le serveur de développement est accessible sur `http://localhost:5173`. Pour consulter la maquette sur un téléphone connecté au même réseau, utiliser l'adresse IP de la machine et le port 5173.

Le build vérifie TypeScript, génère `dist/` et régénère `maquette.html`. Les tests E2E nécessitent Chromium Playwright (`rtk npx playwright install chromium`). Ils utilisent une réponse HTTP interceptée, sans serveur externe.

## Parcours à essayer

1. **Entreprise** : écrire une phrase libre → Comprendre mon besoin → vérifier la reformulation « Est-ce que j’ai bien compris ? » (3 missions minimum, lieu prérempli, niveaux, présence obligatoire seulement si elle est écrite) → Oui, c’est bien ça.
2. Découvrir : glisser à droite pour sélectionner, à gauche pour passer (passer n’est pas refuser) ; annuler un choix si nécessaire. Ouvrir Profil & CV pour la lecture personnalisée, le CV anonymisé et le calendrier. Tous les profils montre le même vivier en grille. Aucun score n’est affiché (spécifications V6).
3. Sélectionner des talents et demander une mise en relation ; retrouver la demande dans l'espace conseiller. Sans profil retenu, demander l’aide du conseiller : le relais apparaît dans ses besoins entreprises.
4. Mon profil : ajouter un site ; il préremplit le lieu du prochain besoin.
5. **Conseiller** : importer un CV fictif → corriger le brouillon → rattacher une formation → saisir d’éventuelles observations factuelles ou le signal interne « à valoriser » → contrôler → publier.
6. Modifier les jours de cours : les profils rattachés héritent du calendrier et leurs contrôles de présence changent.
7. Retirer un talent placé : il disparaît des nouveaux résultats et les demandes existantes signalent le retrait.
8. Explorer l'invitation (avec un premier besoin préparé) et la vérification simulée d'e-mail depuis le guide.

## Structure et documentation

La référence fonctionnelle maintenue est [specificaiton/README.md](specificaiton/README.md) : PDF V3 archivé, 15 documents thématiques enrichis par la maquette, traçabilité, recette, arbitrages et journal. La [règle de gouvernance](specificaiton/spec-process-gouvernance.md) exige une vérification et une mise à jour à chaque nouvelle demande ; elle est inscrite dans [AGENTS.md](AGENTS.md). `rtk npm run spec:check` contrôle la structure, les liens et la couverture documentaire.

`src/components/` contient les écrans ; `src/domain/` les règles et les données fictives ; `tests/` les scénarios de recette ; `scripts/` le packaging et les contrôles navigateur ; `tools/skills/` les skills de design récupérés.

- `docs/DESIGN.md` : direction visuelle.
- `docs/SPEC_COVERAGE.md` : couverture et hypothèses de la section 20.
- `docs/VALIDATION.md` : vérifications et limites.
- `docs/desktop.png` et `docs/mobile.png` : captures de la maquette.

## Simulations

La pertinence interne (jamais affichée), la reformulation du besoin, la lecture personnalisée et les propositions de CV sont simulées par des règles simples. Aucun moteur IA, serveur, authentification réelle, extraction de fichier ou envoi d'e-mail n'est connecté. Les demandes et alertes sont locales.

Aucune donnée personnelle réelle d'étudiant n'est embarquée. Le cloisonnement est illustré à l'écran ; la production devra garantir les droits et la confidentialité côté serveur et sur les documents.
