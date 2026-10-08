---
title: 'Gouvernance et mise à jour continue'
version: '1.0'
date_created: 2026-10-08
last_updated: 2026-10-08
owner: Glimlink
status: reference-consolidee
product_version: V1
pdf_revision: 3
pdf_sections: [18, 20]
maquette_revision: d6f296f
tags: [specification, process, glimlink]
---

# Gouvernance et mise à jour continue

Référence consolidée du PDF V3 et de la session utilisateur, confrontée au code de la maquette `d6f296f`. Les exigences produit et les mécanismes simulés sont distingués ci-dessous.

## 1. Objet et périmètre

Faire de `specificaiton/` la référence Markdown maintenue du produit V1. Cette demande documentaire n’introduit pas une nouvelle version du logiciel. Le répertoire conserve exactement l’orthographe demandée. Les agents, développeurs et responsables produit doivent suivre le même processus à chaque nouvelle demande utilisateur.

## 2. Définitions

- **Exigence** : comportement demandé par le PDF ou décidé explicitement par l’utilisateur.
- **Constat de maquette** : comportement observé dans le code ; il ne vaut pas décision métier définitive.
- **Simulation** : parcours local sans service de production.
- **Arbitrage** : point dont la décision reste ouverte, en particulier au §20.
- **Demande sans impact** : question ou opération qui ne modifie pas le contrat produit ; son examen est consigné.

## 3. Exigences, contraintes et recommandations

| ID      | Source                            | Règle                                                                                                                                                                                                                                 |
| ------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GOV-001 | Demande utilisateur du 08/10/2026 | À chaque nouvelle demande, vérifier l’impact sur les spécifications et les mettre à jour avant de déclarer le travail terminé.                                                                                                        |
| GOV-002 | Demande utilisateur               | Consigner chaque demande dans JOURNAL.md : demande, impact, fichiers mis à jour, décisions/hypothèses et validation. Pour une question sans changement produit, inscrire explicitement « Aucun changement fonctionnel » et la raison. |
| GOV-003 | PDF §20                           | Ne pas transformer une hypothèse technique ou un comportement simulé en exigence approuvée.                                                                                                                                           |
| GOV-004 | Session utilisateur               | Une demande explicite ultérieure peut faire évoluer le PDF ; conserver sa source et l’état antérieur dans la traçabilité.                                                                                                             |
| GOV-005 | Maintenabilité                    | Modifier les exigences existantes concernées au lieu de seulement ajouter une note contradictoire en fin de fichier.                                                                                                                  |
| GOV-006 | Maintenabilité                    | Mettre à jour les critères de recette, liens, métadonnées et écarts en même temps que les règles.                                                                                                                                     |
| GOV-007 | Fidélité au PDF                   | SOURCE_V3.md et le PDF demeurent des archives de référence, sans y insérer les demandes ultérieures.                                                                                                                                  |

La règle GOV-001 est aussi inscrite dans `AGENTS.md`. Une mise à jour purement documentaire ne nécessite pas de reconstruire `maquette.html`. Une évolution de la maquette implique la documentation correspondante dans la même livraison.

## 4. Interfaces et contrats de données

Entrées : demande utilisateur, PDF, état du code et vérifications. Sorties : spécifications thématiques, TRACEABILITE.md, JOURNAL.md et éventuellement mise à jour de l’index. Chaque fichier thématique contient un titre, une version documentaire, des dates, sa source PDF et la révision de maquette examinée.

Ordre d’interprétation : demande explicite actuelle → décisions utilisateur déjà acceptées → règles PDF inchangées → hypothèses identifiées. Le code décrit l’existant, sans arbitrer silencieusement la cible.

## 5. Critères d’acceptation

- **AC-GOV-001** : étant donné une demande modifiant un parcours, lorsque la livraison est terminée, le fichier du parcours, ses critères et le journal reflètent le nouveau comportement.
- **AC-GOV-002** : une simple question de statut produit une entrée sans impact, sans modification artificielle des exigences.
- **AC-GOV-003** : tout point non décidé possède une entrée dans le registre d’arbitrages.
- **AC-GOV-004** : aucune contradiction connue entre spécifications thématiques et dernière décision utilisateur ne reste masquée par une note historique.

## 6. Stratégie de test

Contrôle documentaire : `rtk npm run spec:check`. Revue humaine : confronter les critères aux demandes, au code et aux essais. Un contrôle de liens ou de titres ne prouve pas la conformité métier. Les tests applicatifs appropriés suivent les fichiers de recette, sans imposer une suite complète à une correction documentaire.

## 7. Justification et contexte

Le PDF présente la référence initiale tandis que la session a fait évoluer l’accueil, la sélection, les compétences et les notifications. La documentation doit rendre ces changements explicites et rester exploitable après la fin de cette conversation. Les skills locaux `create-specification` et `update-specification` structurent les documents ; leur chemin par défaut est remplacé par celui demandé par l’utilisateur.

## 8. Dépendances et intégrations

PDF V3, code et tests du dépôt ; compétences documentaires conservées dans `tools/skills/`. Aucun outil externe de tickets, aucun service cloud et aucune publication ne sont requis pour écrire une spécification.

## 9. Exemples et cas limites

Une nouvelle demande « Supprimer les suggestions de l’accueil » modifie la spécification entreprise et sa recette, puis le journal. Une question « Est-ce publié ? » est consignée sans changement fonctionnel. Une demande ambiguë est enregistrée comme telle ; seuls les éléments indépendants de l’arbitrage peuvent être spécifiés comme acquis.

## 10. Critères de validation

Avant de conclure chaque demande : vérifier les sources et impacts, actualiser les documents affectés, consigner les décisions et limites, contrôler les liens, puis indiquer les vérifications réellement exécutées. Ne pas déclarer la suite CLI Playwright réussie lorsque seuls les parcours MCP ont été exécutés.

## 11. Spécifications liées

[Index](README.md), [Traçabilité](TRACEABILITE.md), [Journal](JOURNAL.md), [Arbitrages](spec-process-arbitrages.md), [AGENTS.md](../AGENTS.md), [Source V3](SOURCE_V3.md).
