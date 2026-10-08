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
