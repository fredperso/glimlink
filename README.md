# Glimlink — maquette interactive V1

Maquette React, HTML et TypeScript basée sur les spécifications détaillées V3. V3 est la révision du document ; le produit représenté est la V1.

## Ouvrir

Ouvrez **`maquette.html` directement dans un navigateur moderne**. Le fichier contient tous les scripts, styles et illustrations et fonctionne sans serveur ni CDN.

Le sélecteur en haut permet de passer de l'espace entreprise à l'espace conseiller. Le guide en bas de page propose les parcours et la réinitialisation. Les modifications sont conservées dans le stockage local du navigateur, lorsqu'il est disponible.

## Développer et vérifier

Prérequis : Node.js 24 et npm.

```sh
rtk npm ci
rtk npm run dev
rtk npm run build
rtk npm test
rtk npm run test:e2e
```

Le serveur de développement est accessible sur `http://localhost:5173`. Pour consulter la maquette sur un téléphone connecté au même réseau, utiliser l'adresse IP de la machine et le port 5173.

Le build vérifie TypeScript, génère `dist/` et régénère `maquette.html`. Les tests E2E nécessitent Chromium Playwright (`rtk npx playwright install chromium`). Ils utilisent une réponse HTTP interceptée, sans serveur externe.

## Parcours à essayer

1. **Entreprise** : Décrire mon besoin → choisir un exemple → préparer le brief → renseigner le lieu → confirmer → découvrir les talents.
2. Explorer les cartes : glisser à droite pour sélectionner, à gauche pour passer ; annuler un choix si nécessaire. Ouvrir la fiche complète pour lire les correspondances et le calendrier. La grille reste disponible.
3. Sélectionner des talents et demander une mise en relation ; retrouver la demande dans l'espace conseiller.
4. **Conseiller** : importer un CV fictif → corriger le brouillon → rattacher une formation → contrôler → publier.
5. Modifier les jours de cours : les profils rattachés héritent du calendrier et leurs contrôles de présence changent.
6. Retirer un talent placé : il disparaît des nouveaux résultats et les demandes existantes signalent le retrait.
7. Explorer l'invitation et la vérification simulée d'e-mail depuis le guide.

## Structure et documentation

`src/components/` contient les écrans ; `src/domain/` les règles et les données fictives ; `tests/` les scénarios de recette ; `scripts/` le packaging et les contrôles navigateur ; `tools/skills/` les skills de design récupérés.

- `docs/DESIGN.md` : direction visuelle.
- `docs/SPEC_COVERAGE.md` : couverture et hypothèses de la section 20.
- `docs/VALIDATION.md` : vérifications et limites.
- `docs/desktop.png` et `docs/mobile.png` : captures de la maquette.

## Simulations

Les scores, le préremplissage du brief et les propositions de CV sont simulés. Aucun moteur IA, serveur, authentification réelle, extraction de fichier ou envoi d'e-mail n'est connecté. Les demandes et alertes sont locales.

Aucune donnée personnelle réelle d'étudiant n'est embarquée. Le cloisonnement est illustré à l'écran ; la production devra garantir les droits et la confidentialité côté serveur et sur les documents.
