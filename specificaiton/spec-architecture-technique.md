---
title: 'Architecture technique de production'
version: '1.0'
date_created: 2026-10-23
last_updated: 2026-10-23
owner: Glimlink
status: proposition-technique
product_version: V1
pdf_revision: 3
pdf_sections: ['A', 2, 3, 14, 15, 16, 19, 20]
maquette_revision: travail-local-USR-23
tags: [specification, architecture, securite, glimlink]
---

# Architecture technique de production

Spécification technique de la V1 de production de Glimlink. Elle traduit les spécifications fonctionnelles consolidées (V3, puis V6 lorsqu’elle diffère) en composants, technologies, règles de sécurité, déploiement et tests. La maquette React reste une maquette : elle sert de référence de comportement, pas de base de code de production.

Statut des informations, à lire avant toute exigence :

- **Décision utilisateur USR-24 (23 octobre 2026)** : back en Java ; front sans framework JavaScript applicatif, Bootstrap suffisant ; MFA intégrée à l’application ; FIDO2.
- **Contrainte acquise** : PRO-008, cloud souverain européen, préférence France (USR-20).
- **Choix de conception** (source « Conception ») : proposition de cette spécification, à valider en revue technique avant le lot 0. Ce n’est pas une décision métier.
- **Point ouvert** : renvoi explicite à un arbitrage (ARB-xxx). Aucune valeur proposée ici ne clôt un arbitrage.

Versions vérifiées le 23 octobre 2026 : Java 25 LTS, Spring Boot 4.1, Spring Security 7.1 (ligne stable). Elles sont à revérifier au démarrage du lot 0.

## Table des matières

- [1. Objet et périmètre](#1-objet-et-périmètre)
- [2. Définitions](#2-définitions)
- [3. Exigences, contraintes et recommandations](#3-exigences-contraintes-et-recommandations)
- [4. Interfaces et contrats de données](#4-interfaces-et-contrats-de-données)
- [5. Critères d’acceptation](#5-critères-dacceptation)
- [6. Stratégie de test](#6-stratégie-de-test)
- [7. Justification et contexte](#7-justification-et-contexte)
- [8. Dépendances et intégrations](#8-dépendances-et-intégrations)
- [9. Exemples et cas limites](#9-exemples-et-cas-limites)
- [10. Critères de validation](#10-critères-de-validation)
- [11. Spécifications liées](#11-spécifications-liées)

## 1. Objet et périmètre

**Objet** : définir l’architecture de production de la V1, de façon à réduire au minimum la surface d’attaque et les erreurs de sécurité écrites à la main.

**Périmètre** : composants applicatifs, authentification et MFA, autorisations et isolation des viviers, persistance, fichiers CV, IA générative, front, infrastructure Scaleway, chaîne de livraison, exploitation, tests et découpage en lots.

**Hors périmètre** : règles métier (spécifications fonctionnelles thématiques) ; choix contractuel final du fournisseur et qualification SecNumCloud (ARB-011) ; qualification juridique RGPD et AI Act (ARB-008, ARB-009) ; compte étudiant (ACC-003) ; intégrations externes (ARB-005).

**Public** : équipe de réalisation, référents sécurité, données et IA, responsable produit.

**Hypothèse de dimensionnement** (à confirmer, ARB-011) : moins de 100 utilisateurs connectés simultanément, moins de 10 000 profils candidats, moins de 1 000 analyses de CV par mois. Aucune exigence de haute disponibilité multi-région.

## 2. Définitions

- **FIDO2** : standard d’authentification sans mot de passe de la FIDO Alliance et du W3C, composé de WebAuthn (API du navigateur) et de CTAP2 (protocole entre navigateur et authentificateur).
- **Passkey (clé d’accès)** : identifiant FIDO2 composé d’une paire de clés. La clé privée reste dans l’authentificateur (téléphone, ordinateur, clé matérielle) ; le serveur ne stocke que la clé publique.
- **Vérification de l’utilisateur (UV)** : contrôle local par l’authentificateur (PIN, empreinte, visage) avant signature.
- **MFA** : authentification multifacteur. Une authentification FIDO2 avec UV combine possession (authentificateur) et connaissance ou inhérence (PIN, biométrie) ; elle constitue une MFA résistante à l’hameçonnage.
- **Facteur (Spring Security)** : autorité `FactorGrantedAuthority` ajoutée à la session à chaque facteur réussi (par exemple WebAuthn ou jeton à usage unique). Une règle d’autorisation peut exiger un ou plusieurs facteurs.
- **OTT (jeton à usage unique)** : lien ou code envoyé par e-mail, valable une seule fois et pour une durée courte.
- **RLS (Row-Level Security)** : politique PostgreSQL qui filtre les lignes visibles selon le contexte de la transaction.
- **Instantané publié** : version immuable des champs professionnels validés d’un candidat, seule source lue par une entreprise.
- **Projection** : type de données ne contenant que les champs autorisés pour un rôle.
- **SSR** : rendu des pages HTML côté serveur.
- **CSP** : Content Security Policy, en-tête qui restreint les ressources exécutables par le navigateur.
- **CSRF** : falsification de requête intersite.
- **HSTS** : en-tête qui impose HTTPS au navigateur.
- **LLM** : grand modèle de langage. **Injection de prompt** : texte placé dans une donnée (CV, besoin) visant à détourner les consignes du LLM.
- **Worker** : processus qui exécute les tâches asynchrones (analyse de CV, appels IA, e-mails, purges).
- **SBOM** : inventaire des composants logiciels d’une image.
- **ASVS** : OWASP Application Security Verification Standard.

## 3. Exigences, contraintes et recommandations

### 3.1 Socle et architecture

| ID      | Source              | Exigence                                                                                                                                                                                                                                                       |
| ------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ARC-001 | USR-24              | Back en Java 25 LTS avec Spring Boot 4.1 et Spring Security 7.1. Chaque composant reste sur une ligne maintenue ; la migration vers la ligne suivante est planifiée avant la fin du support communautaire.                                                    |
| ARC-002 | USR-24              | Front sans framework JavaScript applicatif : pages rendues côté serveur (Thymeleaf), mise en forme Bootstrap 5.3, mises à jour partielles par htmx 2, JavaScript natif limité aux interactions (swipe, calendrier). Aucune SPA ; aucune API JSON publique destinée au navigateur. |
| ARC-003 | Conception          | Monolithe modulaire : un dépôt, un artefact, deux processus (`web` pour HTTP, `worker` pour les tâches asynchrones). Modules : `identity`, `organisation`, `students`, `needs`, `discovery`, `requests`, `notifications`, `ai`, `administration`, `audit`. Les dépendances entre modules sont vérifiées par test (Spring Modulith). |
| ARC-004 | Conception          | Les règles métier sont écrites en Java dans des classes de domaine sans dépendance au framework. Les règles de `src/domain` (projections, publication, calendrier, pertinence, swipe) sont la référence de comportement ; les scénarios V3-01 à V3-12 et V6 sont réécrits en JUnit. |
| ARC-005 | PRO-008             | Tous les services traitant des données (application, base, fichiers, sauvegardes, journaux, e-mails, IA) sont opérés dans l’Union européenne, en région Paris lorsque le service y est disponible. Chaque service est documenté selon AC-ARB-005.          |
| ARC-006 | Conception          | Aucune ressource tierce chargée à l’exécution : pas de CDN, polices et scripts auto-hébergés, aucun outil tiers de mesure d’audience.                                                                                                                       |
| ARC-007 | Conception          | Objectif de vérification : OWASP ASVS 5.0 niveau 2 pour l’ensemble de l’application, niveau 3 pour l’authentification, les sessions et le contrôle d’accès.                                                                                                |

### 3.2 Authentification et MFA

| ID      | Source              | Exigence                                                                                                                                                                                                                                                       |
| ------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUT-001 | USR-24              | La MFA est intégrée à l’application (Spring Security 7, facteurs exigés par règle d’autorisation), sans fournisseur d’identité externe.                                                                                                                    |
| AUT-002 | USR-24, ACC-009     | Administrateurs et conseillers : passkey FIDO2 avec vérification de l’utilisateur (`userVerification=required`) obligatoire. Toute route `/conseiller/**` et `/admin/**` exige le facteur WebAuthn.                                                       |
| AUT-003 | Conception          | Aucun mot de passe dans la V1. Facteurs admis : WebAuthn ; jeton à usage unique par e-mail, uniquement pour les entreprises et pour le premier enrôlement.                                                                                                  |
| AUT-004 | ACC-001, ACC-002    | Invitation : jeton aléatoire d’au moins 128 bits, stocké haché (SHA-256), à usage unique, lié à l’e-mail invité, révocable. Durée proposée : 7 jours (ARB-021). L’activation vérifie l’e-mail.                                                            |
| AUT-005 | ACC-009, ARB-021    | Entreprises : enrôlement d’une passkey proposé à l’activation. À défaut, connexion par lien à usage unique envoyé par e-mail, valable 10 minutes. Le caractère obligatoire de la MFA pour les entreprises est ouvert (ARB-021).                            |
| AUT-006 | Conception          | Premier accès d’un conseiller ou administrateur : le lien d’invitation ouvre uniquement la page d’enrôlement. Aucune autre page n’est accessible avant l’enregistrement d’une passkey, suivi d’une authentification avec celle-ci.                       |
| AUT-007 | Conception          | Paramètres WebAuthn : identifiant de partie de confiance (RP ID) égal au domaine de production ; origines autorisées limitées à ce domaine ; algorithmes ES256 et RS256 ; attestation `none`. Le serveur conserve la clé publique, le compteur de signature, le nom donné par l’utilisateur, la date de création et celle du dernier usage. L’utilisateur peut nommer et révoquer ses passkeys ; deux passkeys sont recommandées pour conseillers et administrateurs. |
| AUT-008 | Conception, ARB-021 | Récupération d’accès conseiller ou administrateur : uniquement par un administrateur, après vérification d’identité hors ligne, avec journalisation. La réinitialisation d’un administrateur exige l’action d’un second administrateur. Aucune récupération en libre-service par e-mail pour ces rôles. |
| AUT-009 | Conception          | Sessions côté serveur (Spring Session JDBC). Cookie `__Host-` avec les attributs `Secure`, `HttpOnly` et `SameSite=Lax`. Identifiant régénéré à chaque connexion. Inactivité proposée : 30 minutes (conseiller, administrateur), 2 heures (entreprise). Durée absolue : 12 heures. La déconnexion invalide la session côté serveur. |
| AUT-010 | Conception          | Nouvelle authentification WebAuthn exigée si la dernière date de plus de 5 minutes avant : modification de droits, réinitialisation d’accès, export de données, suppression, révocation de passkey.                                                       |
| AUT-011 | Conception          | Limitation de débit par adresse IP et par compte sur les demandes de lien, les invitations et les cérémonies WebAuthn (proposition : 5 demandes par 15 minutes). Réponse identique, que le compte existe ou non.                                       |

### 3.3 Autorisations et isolation

| ID      | Source                                   | Exigence                                                                                                                                                                                                                                       |
| ------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUZ-001 | ACC-004, ACC-007, ACC-008                | Refus par défaut : toute route non déclarée est refusée. Chaque service applicatif vérifie le rôle et le périmètre (organisation, campus, marque, formation) au niveau de la méthode, pas seulement de l’URL.                              |
| AUZ-002 | SEC-ACC-001, DAT-004, DAT-008            | Les lectures entreprise passent exclusivement par le schéma `publication`, dont les vues ne contiennent ni coordonnées privées, ni brouillon, ni observations, ni signal « à valoriser », ni note de suivi, ni pertinence interne. Les types Java de lecture entreprise sont des records distincts sans ces champs. |
| AUZ-003 | Conception                               | Seconde barrière RLS : l’application se connecte avec un rôle PostgreSQL non propriétaire, sans l’attribut `BYPASSRLS`. Chaque transaction positionne `app.user_id`, `app.role` et `app.company_id` par `SET LOCAL`. Les politiques filtrent candidats, besoins, demandes et instantanés par périmètre. |
| AUZ-004 | Conception                               | Identifiants exposés dans les URL : UUID aléatoires, jamais séquentiels. Une ressource hors périmètre répond 404, sans distinguer inexistante et interdite.                                                                                  |
| AUZ-005 | SEC-ACC-002, AC-ACC-005                  | L’ouverture d’un lien (notification, e-mail, favori) revérifie la session, les droits et l’état de la ressource (profil retiré, besoin clôturé).                                                                                            |
| AUZ-006 | ACC-008, ACC-007                         | Aucun droit implicite entre marques : un conseiller n’accède aux candidats d’une autre marque que par une autorisation explicite et journalisée (modèle ouvert, ARB-005).                                                                   |

### 3.4 Persistance

| ID      | Source                      | Exigence                                                                                                                                                                                                                  |
| ------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PER-001 | Conception                  | PostgreSQL managé, dernière version majeure proposée par le service. Le schéma évolue uniquement par des migrations Flyway versionnées et relues, exécutées par un rôle propriétaire distinct du rôle applicatif.      |
| PER-002 | DAT-002, DAT-007, FIC-001–003 | Brouillon, versions publiées et instantanés de demande sont stockés séparément. Une publication crée une nouvelle version publiée dans une transaction ; un brouillon ne modifie jamais une version publiée.            |
| PER-003 | Conception                  | Accès aux données par Spring Data JDBC et requêtes paramétrées uniquement. La concaténation de SQL est interdite et contrôlée par analyse statique.                                                                      |
| PER-004 | Conception                  | Chiffrement : chiffrement au repos du service managé ; TLS vérifié entre application et base (`sslmode=verify-full`). Recommandation à confirmer : chiffrement applicatif AES-GCM des coordonnées privées, clé dans Secret Manager. |
| PER-005 | ARB-008                     | Purge planifiée paramétrable des données personnelles et des fichiers. La suppression efface coordonnées, documents et extractions IA et ne conserve qu’un historique minimal pseudonymisé. Durées à fixer (ARB-008).    |
| PER-006 | Conception                  | File de tâches persistée dans PostgreSQL (db-scheduler ou JobRunr sans tableau de bord exposé ; choix au lot 0). Tâches idempotentes, nouvelles tentatives à délai croissant, échecs définitifs consignés.              |
| PER-007 | Conception                  | Concurrence : verrouillage optimiste (colonne `version`) sur candidats, besoins et demandes ; un conflit d’édition est signalé à l’utilisateur, sans écrasement silencieux.                                             |

### 3.5 Fichiers CV

| ID      | Source                  | Exigence                                                                                                                                                                                                                 |
| ------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FCH-001 | ARB-007                 | Formats proposés : PDF et DOCX, 5 Mo et 10 pages au plus. Type contrôlé par signature binaire, pas par extension. PDF chiffrés ou contenant du JavaScript ou des fichiers joints refusés. Valeurs à valider (ARB-007).   |
| FCH-002 | Conception              | Stockage dans Object Storage privé : bucket non public, chiffrement côté serveur, versionnage, nom d’objet aléatoire. Le CV source n’est accessible qu’au conseiller habilité, par un contrôleur qui vérifie les droits, journalise l’accès et répond en `Content-Disposition: attachment`. |
| FCH-003 | FIC-008, SEC-FIC-001    | Le CV anonymisé destiné à l’entreprise est un PDF généré par l’application à partir de la version publiée. Ce n’est jamais le fichier source expurgé : il ne contient ni calque masqué, ni métadonnée d’auteur, ni coordonnée privée. Choix à valider (ARB-007). |
| FCH-004 | Conception              | Analyse des fichiers dans le worker uniquement : extraction de texte (PDFBox, Apache POI) sans exécution de contenu, avec un délai maximal de 30 secondes et une mémoire bornée. Recommandation : analyse antivirus avant traitement. |

### 3.6 IA générative

| ID      | Source                          | Exigence                                                                                                                                                                                                                        |
| ------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IAG-001 | V6 §1, §5, §8, §14, §15         | Quatre usages, chacun avec son modèle de prompt versionné et son modèle configurable : reformulation du besoin, extraction de CV, lecture personnalisée (pourquoi ce profil, en lien avec vos missions), formulation neutre des observations et comptes rendus du conseiller. |
| IAG-002 | PRO-008                         | Fournisseur : Scaleway Generative APIs (Paris), appelé par Spring AI avec le client compatible OpenAI. Tout autre fournisseur exige une revue PRO-008. La non-conservation des prompts est vérifiée contractuellement.      |
| IAG-003 | V6 §1                           | Sorties structurées en JSON conformes à un schéma (record Java validé par Bean Validation). Une sortie invalide est rejetée et tracée ; la saisie manuelle reste possible (FIC-002). Aucune sortie IA n’est publiée sans validation humaine : conseiller pour les CV et les observations, entreprise pour la reformulation. |
| IAG-004 | Conception                      | Le LLM n’a ni outil, ni accès à la base, ni action déclenchable. Les contenus de CV et de besoin sont traités comme des données non fiables et délimités dans le prompt. La sortie est échappée à l’affichage ; elle n’est jamais rendue en HTML ou Markdown. |
| IAG-005 | ARB-008, SEC-ACC-001            | Minimisation : e-mail, téléphone, adresse et nom de famille connus sont retirés avant l’envoi d’un CV. La lecture personnalisée n’utilise que la version publiée et le besoin validé. Le signal « à valoriser » n’est jamais transmis dans un texte destiné à l’entreprise. |
| IAG-006 | MAT-006, PRO-009, ARB-004       | Aucun score affiché. La pertinence interne est calculée par un moteur de règles Java déterministe et testé. Une similarité sémantique (vecteurs stockés dans pgvector) reste une option soumise à ARB-004.              |
| IAG-007 | V6 §21, ARB-007                 | Chaque appel IA est tracé : usage, version du prompt, modèle, date, durée, jetons consommés, statut, objet concerné. Les entrées et sorties sont conservées en base pour audit et correction, avec la durée de conservation du CV, et jamais dans les journaux d’exploitation. |
| IAG-008 | Conception                      | Délai maximal de 30 secondes par appel, deux nouvelles tentatives au plus, coupure automatique (circuit breaker), quota mensuel par usage. Sans IA, l’application reste utilisable : saisie manuelle du CV, besoin saisi sans reformulation. |
| IAG-009 | ARB-009                         | Supervision humaine, journalisation et documentation technique prévues dès la conception pour faciliter une éventuelle mise en conformité à l’AI Act. Cette spécification ne conclut pas sur la qualification.        |

### 3.7 Front

| ID      | Source              | Exigence                                                                                                                                                                                                                       |
| ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FRT-001 | USR-24              | Gabarits Thymeleaf avec échappement automatique. `th:utext` est interdit, ce que l’intégration continue vérifie.                                                                                                              |
| FRT-002 | Conception          | CSP : `default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'`. Aucun script inline ni attribut `on*`. Configuration htmx : `allowEval=false`, `allowScriptTags=false`, `selfRequestsOnly=true`, `includeIndicatorStyles=false`. |
| FRT-003 | Conception          | Bootstrap et htmx sont livrés comme fichiers compilés, à versions figées, servis par l’application. Le thème USR-21 surcharge les variables CSS de Bootstrap dans une feuille dédiée. Le JavaScript natif est écrit en modules ES sans outil d’assemblage : aucune chaîne npm n’entre dans la construction de production. |
| FRT-004 | ENT-010, UX-012–013 | Swipe : un module ES natif reprend le moteur de geste USR-22 (pointer events, requestAnimationFrame, Web Animations). Chaque décision est envoyée au serveur par une requête POST htmx protégée contre le CSRF ; le serveur est la seule source de vérité de la sélection. Les boutons et les raccourcis clavier restent l’alternative au geste. |
| FRT-005 | Conception          | Jeton CSRF de Spring Security exigé sur toute requête qui modifie des données, y compris en htmx (en-tête lu depuis une balise `meta`). Une requête GET n’a aucun effet de bord.                                            |
| FRT-006 | UX-001–013          | Amélioration progressive : les parcours essentiels fonctionnent sans JavaScript, sauf le geste de swipe, remplacé par des boutons. Objectif d’accessibilité : WCAG 2.2 AA.                                                    |
| FRT-007 | Conception          | En-têtes : HSTS (1 an, `includeSubDomains`), `X-Content-Type-Options: nosniff`, `Referrer-Policy: same-origin`, `Cross-Origin-Opener-Policy: same-origin`, `Permissions-Policy` qui interdit caméra, micro et géolocalisation et réserve `publickey-credentials-get` et `publickey-credentials-create` à l’origine. |

### 3.8 Infrastructure

| ID      | Source              | Exigence                                                                                                                                                                                                                                                         |
| ------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INF-001 | PRO-008, ANAL-003   | Scaleway, région fr-par, projet dédié dans le compte existant. Services : Serverless Containers (`web`, `worker`) rattachés à un Private Network ; Managed Database for PostgreSQL joignable uniquement par ce réseau privé ; Object Storage ; Transactional Email ; Secret Manager ; Container Registry ; Cockpit ; Generative APIs. |
| INF-002 | Conception          | Environnements `recette` et `production` séparés : projets, bases, buckets, clés et domaines distincts. Données fictives uniquement en recette ; aucune copie de la production vers la recette.                                                                   |
| INF-003 | Conception          | Une instance minimum toujours active (`min-scale=1`) pour `web` et `worker` en production, afin d’éviter le démarrage à froid et de garantir le traitement de la file.                                                                                            |
| INF-004 | Conception          | Domaine personnalisé, certificat TLS géré, TLS 1.2 au minimum, enregistrement DNS CAA ; DNSSEC si le registraire le permet.                                                                                                                                      |
| INF-005 | NOT-001–010         | E-mails envoyés depuis un domaine authentifié par SPF, DKIM et DMARC (`p=reject` après une période d’observation). Ils ne contiennent aucune donnée de candidat : seulement un libellé d’événement et un lien vers l’application.                                 |
| INF-006 | Conception          | Secrets dans Secret Manager, lus au démarrage. Aucun secret dans le dépôt, l’image ou les journaux. Procédure de rotation documentée.                                                                                                                             |
| INF-007 | Conception          | IAM Scaleway : comptes nominatifs avec MFA ; une clé d’API par usage avec les droits minimaux (la clé de déploiement ne peut que publier une image et déployer les conteneurs du projet).                                                                         |

### 3.9 Chaîne de livraison

| ID      | Source      | Exigence                                                                                                                                                                                                                         |
| ------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| LIV-001 | Conception  | Construction Maven avec wrapper vérifié, versions explicites, Maven Enforcer (versions instantanées interdites, convergence des dépendances) et somme de contrôle obligatoire.                                                 |
| LIV-002 | Conception  | Contrôles bloquants en intégration continue : tests ; analyse des dépendances (OWASP Dependency-Check, blocage à partir d’un CVSS de 7) ; analyse statique (SpotBugs avec FindSecBugs, puis CodeQL ou Semgrep) ; recherche de secrets (gitleaks). |
| LIV-003 | Conception  | Image construite par Jib sur une base Java 25 minimale sans shell (distroless ou équivalent), exécutée par un utilisateur non root. SBOM CycloneDX produit ; analyse Trivy bloquante ; déploiement de l’image par son empreinte (digest).        |
| LIV-004 | Conception  | GitHub : branche `main` protégée, revue obligatoire, 2FA obligatoire, actions tierces figées par SHA, permissions minimales du `GITHUB_TOKEN`, environnement `production` soumis à approbation manuelle. Renovate ou Dependabot chaque semaine. |
| LIV-005 | Conception  | Déploiement en trois étapes : migrations Flyway par une tâche dédiée, puis déploiement de `worker`, puis de `web`. Les migrations restent compatibles avec la version précédente de l’application.                             |

### 3.10 Exploitation

| ID      | Source              | Exigence                                                                                                                                                                                                                  |
| ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| EXP-001 | FIC-004, V6 §21     | Journal d’audit applicatif en ajout seul (le rôle applicatif ne peut qu’insérer). Événements : connexions et échecs, enrôlement et révocation de passkey, consultation d’une fiche complète ou d’un CV source, publication, retrait, export, changement de droits, réinitialisation d’accès. |
| EXP-002 | Conception          | Journaux techniques structurés (JSON) envoyés vers Cockpit, avec identifiant de corrélation. Ils ne contiennent ni donnée de candidat, ni jeton, ni contenu IA.                                                          |
| EXP-003 | ARB-011             | Sauvegardes automatiques de la base (rétention proposée : 14 jours) dont la localisation est vérifiée. Versionnage des buckets. Test de restauration trimestriel documenté.                                               |
| EXP-004 | Conception          | Alertes : taux d’erreurs, échecs d’authentification anormaux, file de tâches bloquée, quota IA atteint, expiration de certificat.                                                                                        |
| EXP-005 | Conception          | Correctifs de sécurité critiques déployés sous 7 jours (proposition). Revue mensuelle des dépendances et suivi des fins de support de Java, Spring et PostgreSQL.                                                         |
| EXP-006 | Conception, ARB-008 | Avant l’ouverture : analyse de risques, analyse d’impact relative à la protection des données (AIPD) à évaluer avec le référent données, test d’intrusion externe. Les vulnérabilités élevées sont corrigées avant la mise en production. |

## 4. Interfaces et contrats de données

### Vue d’ensemble

```text
Navigateur (HTML + Bootstrap + htmx + modules ES)
   │ HTTPS, cookie de session __Host-, jeton CSRF
   ▼
Serverless Container « web » (Spring Boot)      Serverless Container « worker »
   │ Spring Security : WebAuthn, OTT, facteurs       │ file de tâches PostgreSQL
   │ Thymeleaf, services de domaine                  │ PDFBox / POI, Spring AI, e-mails, purges
   └──────────────┬──────────────────────────────────┘
                  │ Private Network (TLS)
                  ▼
     Managed PostgreSQL (schémas métier, publication, audit, sessions, tâches)
   web/worker ─► Object Storage privé (CV source, CV anonymisé généré)
   worker ─────► Generative APIs (fr-par)   worker ─► Transactional Email
   web/worker ─► Secret Manager             web/worker ─► Cockpit (journaux, métriques)
```

### Modules et correspondance avec la maquette

| Module           | Responsabilité                                                                     | Référence de comportement dans la maquette                 |
| ---------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `identity`       | Comptes, invitations, passkeys, jetons à usage unique, sessions, récupération     | `partners.ts` (activation), `ManagedUser` dans `model.ts`  |
| `organisation`   | Organisation, campus, marques, formations, calendriers, exceptions                 | `calendar.ts`, `skills.ts`, `Calendar` dans `model.ts`     |
| `students`       | Fiches, coordonnées privées, brouillon, publication, retrait, CV, observations     | `Student`, `StudentDetails`, `StudentPersonalDetails`      |
| `needs`          | Besoin, reformulation, missions, sites, validation                                 | `brief.ts`, `Need`                                         |
| `discovery`      | Pertinence interne, ordre de présentation, Déclic, sélection et profils passés      | `reading.ts`, `swipe.ts`, fonctions de pertinence de `model.ts` |
| `requests`       | Demandes de mise en relation, instantanés, suivi, clôture                          | `Request`                                                  |
| `notifications`  | Talent Alerts, notifications internes, e-mails                                     | `notifications.ts`, `Alert`                                |
| `ai`             | Prompts versionnés, appels, validation des sorties, traces                         | Aucun : simulé dans la maquette                            |
| `administration` | Utilisateurs, entreprises, droits, formations                                      | Espace administrateur USR-17                               |
| `audit`          | Journal d’audit en ajout seul                                                      | Aucun                                                      |

### Schéma physique proposé

| Schéma PostgreSQL | Tables principales                                                                                                       | Accès du rôle applicatif                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| `identity`        | `app_user`, `passkey_credential`, `user_entity`, `one_time_token`, `invitation`, `spring_session`                        | Lecture et écriture                           |
| `organisation`    | `organisation`, `campus`, `brand`, `training`, `training_skill`, `calendar`, `calendar_exception`                         | Lecture et écriture, RLS par campus et marque |
| `company`         | `company`, `company_site`, `company_brand_access`                                                                        | Lecture et écriture, RLS par entreprise       |
| `student`         | `student`, `student_private_details`, `student_draft`, `student_publication` (versions immuables), `cv_document`, `ai_extraction`, `adviser_observation` | Lecture et écriture, RLS par marque           |
| `need`            | `need`, `need_mission`, `discovery_decision` (sélectionné, passé)                                                        | Lecture et écriture, RLS par entreprise et marque |
| `request`         | `contact_request`, `contact_request_student`, `request_snapshot`                                                         | Lecture et écriture, RLS                      |
| `publication`     | Vues `published_student`, `published_calendar`, sans colonne privée                                                      | Lecture seule, seule source de l’entreprise   |
| `notification`    | `talent_alert`, `notification`                                                                                           | Lecture et écriture, RLS par destinataire     |
| `audit`           | `audit_event`, `ai_call`                                                                                                 | Insertion seule                               |

Les noms reprennent le vocabulaire anglais du code de la maquette. Le découpage formation / promotion reste ouvert (ARB-002) : `calendar` peut être rattaché plus tard à une promotion sans changer les contrats de publication.

### Matrice des facteurs exigés

| Zone                                        | Rôle            | Facteurs exigés                                   |
| ------------------------------------------- | --------------- | ------------------------------------------------- |
| `/invitation/{jeton}`, `/connexion`         | Anonyme         | Aucun                                             |
| `/compte/cles-acces/enrolement`             | Tout rôle invité | Jeton à usage unique de l’invitation             |
| `/entreprise/**`                            | Entreprise      | WebAuthn ou jeton à usage unique (ARB-021)        |
| `/conseiller/**`                            | Conseiller      | WebAuthn avec vérification de l’utilisateur       |
| `/admin/**`                                 | Administrateur  | WebAuthn avec vérification de l’utilisateur       |
| Opérations sensibles (AUT-010)              | Tout rôle       | WebAuthn datant de moins de 5 minutes             |

Points d’entrée WebAuthn et OTT : chemins par défaut de Spring Security, à confirmer pendant la réalisation (options et vérification d’enregistrement, options et vérification d’authentification, génération et consommation du jeton).

### Contrat de sortie IA : extraction de CV

```json
{
  "schemaVersion": "cv-extraction/1",
  "firstName": "Inès",
  "location": "Lyon",
  "experiences": [{ "title": "Vendeuse", "organisation": "Boutique", "period": "2025", "missions": ["Accueil client"] }],
  "skills": [{ "name": "Relation client", "evidence": "Accueil client en boutique" }],
  "languages": [{ "name": "Anglais", "level": "B2" }],
  "license": "unknown",
  "uncertainties": ["Dates de l’expérience non précisées"]
}
```

Règles : un champ non trouvé vaut `unknown` ou est absent, jamais une valeur supposée (FIC-007) ; aucune coordonnée privée n’est attendue ; `evidence` cite le passage source pour faciliter la validation du conseiller ; la sortie complète un brouillon et ne publie rien.

### Configuration et secrets

| Nom                         | Nature     | Source            |
| --------------------------- | ---------- | ----------------- |
| `GLIMLINK_DB_URL`, `GLIMLINK_DB_USER`, `GLIMLINK_DB_PASSWORD` | Secret | Secret Manager |
| `GLIMLINK_S3_ACCESS_KEY`, `GLIMLINK_S3_SECRET_KEY`, `GLIMLINK_S3_BUCKET` | Secret | Secret Manager |
| `GLIMLINK_AI_API_KEY`, `GLIMLINK_AI_MODEL_*`  | Secret / paramètre | Secret Manager |
| `GLIMLINK_MAIL_API_KEY`     | Secret     | Secret Manager    |
| `GLIMLINK_PII_KEY`          | Secret (si PER-004 est retenu) | Secret Manager |
| `GLIMLINK_RP_ID`, `GLIMLINK_ALLOWED_ORIGIN` | Paramètre | Configuration du conteneur |

### Lots de réalisation

Le découpage suit les priorités V6 §22, précédé d’un socle de sécurité.

| Lot | Contenu                                                                                         | Priorités V6 couvertes |
| --- | ----------------------------------------------------------------------------------------------- | ---------------------- |
| 0   | Infrastructure de recette, intégration continue, socle Spring, FIDO2, sessions, audit, en-têtes | Préalable              |
| 1   | Organisation, droits, RLS, invitation entreprise, profil multi-sites, administration            | 1                      |
| 2   | Import de CV, extraction IA, validation et publication conseiller, observations, signal interne  | 5, 8                   |
| 3   | Besoin libre, reformulation IA, brief complet, calendrier si exprimé                            | 2, 3, 4                |
| 4   | Moteur de pertinence, lecture personnalisée, Déclic, swipe, grille, CV anonymisé, calendrier    | 6, 7, 9, 10            |
| 5   | Sélection, mise en relation, routage conseiller, relais humain, Talent Alerts, e-mails          | 11, 12, 13             |
| 6   | Durcissement, AIPD, test d’intrusion, recette de production, ouverture                          | —                      |

## 5. Critères d’acceptation

- **AC-ARC-001** : Étant donné un conseiller invité sans passkey, quand il ouvre son lien d’invitation, alors seule la page d’enrôlement est accessible, et toute URL `/conseiller/**` le renvoie vers cette page.
- **AC-ARC-002** : Étant donné une session qui ne porte que le facteur jeton à usage unique, quand elle demande une page `/conseiller/**` ou `/admin/**`, alors l’accès est refusé et l’utilisateur est invité à s’authentifier par passkey.
- **AC-ARC-003** : Étant donné une assertion WebAuthn signée pour une autre origine ou un autre RP ID, quand elle est soumise, alors elle est rejetée et l’échec est journalisé.
- **AC-ARC-004** : Étant donné un lien d’invitation déjà utilisé, expiré ou révoqué, quand il est ouvert, alors aucun compte n’est activé et le message ne révèle pas l’existence du compte.
- **AC-ARC-005** : Étant donné une entreprise autorisée sur la seule marque A, quand elle demande directement l’URL d’un candidat de la marque B, alors la réponse est 404. Une requête SQL exécutée avec le contexte de cette entreprise sur le rôle applicatif renvoie 0 ligne.
- **AC-ARC-006** : Étant donné des candidats de test dont les champs privés contiennent des valeurs sentinelles, quand toutes les pages et fragments entreprise d’un parcours complet sont collectés, alors aucune valeur sentinelle n’y figure.
- **AC-ARC-007** : Étant donné un CV anonymisé téléchargé par une entreprise, quand son texte et ses métadonnées sont extraits, alors il ne contient ni nom de famille, ni e-mail, ni téléphone, ni adresse, ni auteur du fichier source.
- **AC-ARC-008** : Étant donné un CV qui contient une consigne d’injection de prompt, quand il est analysé, alors aucune action n’est déclenchée, la sortie respecte le schéma ou est rejetée, et le profil reste un brouillon.
- **AC-ARC-009** : Étant donné le service IA indisponible, quand un conseiller importe un CV, alors il peut compléter la fiche manuellement et aucune publication automatique n’a lieu.
- **AC-ARC-010** : Étant donné la CSP active, quand un script inline est injecté dans un champ de saisie, alors il est affiché comme texte, n’est pas exécuté, et les parcours E2E ne produisent aucune violation de CSP.
- **AC-ARC-011** : Étant donné une session valide, quand une requête POST arrive sans jeton CSRF valide, alors elle est refusée (403) sans effet.
- **AC-ARC-012** : Étant donné une dépendance qui porte une vulnérabilité de CVSS 7 ou plus, quand le pipeline s’exécute, alors la construction échoue.
- **AC-ARC-013** : Étant donné l’infrastructure de production, quand un balayage réseau est mené depuis Internet, alors la base PostgreSQL n’est pas joignable.
- **AC-ARC-014** : Étant donné une sauvegarde de production, quand la procédure de restauration est exécutée dans un environnement isolé, alors la base restaurée est cohérente et la durée de restauration est consignée.
- **AC-ARC-015** : Étant donné un conseiller qui ouvre le CV source d’un candidat, quand l’audit est consulté, alors l’événement indique l’utilisateur, le candidat, la date et l’action.
- **AC-ARC-016** : Étant donné une Talent Alert envoyée par e-mail, quand le message est inspecté, alors il ne contient aucune donnée de candidat, seulement un lien vers l’application.
- **AC-ARC-017** : Étant donné une session de conseiller inactive depuis plus de 30 minutes, quand une page est demandée, alors une nouvelle authentification est exigée ; après déconnexion, l’ancien cookie de session n’ouvre plus aucune page.
- **AC-ARC-018** : Étant donné un administrateur qui a perdu ses passkeys, quand une réinitialisation est demandée, alors elle n’aboutit qu’après validation par un second administrateur et elle est journalisée.

## 6. Stratégie de test

- **Niveaux** : tests unitaires des règles de domaine ; tests d’intégration avec une vraie base PostgreSQL (Testcontainers), y compris les politiques RLS ; tests de sécurité Spring Security Test (facteurs, CSRF, refus par défaut) ; tests de bout en bout Playwright pour Java sur ordinateur et mobile.
- **FIDO2** : authentificateur virtuel WebAuthn de Chromium piloté par Playwright pour l’enrôlement, la connexion, la révocation et les origines invalides. Essai manuel sur appareils réels (iOS, Android, Windows, clé matérielle) avant chaque lot livré.
- **Isolation** : jeu de données fictif multi-campus et multi-marques ; chaque route entreprise et conseiller est testée avec un utilisateur hors périmètre (AC-ARC-005, AC-ARC-006).
- **Architecture** : Spring Modulith ou ArchUnit vérifie les dépendances entre modules et l’absence d’accès des contrôleurs entreprise aux tables privées.
- **IA** : réponses de modèle enregistrées pour les tests automatisés ; jeu d’évaluation de CV et de besoins fictifs, dont des injections de prompt et des CV dégradés, rejoué à chaque changement de prompt ou de modèle (lien avec ARB-012).
- **Sécurité dynamique** : OWASP ZAP en mode passif sur la recette à chaque déploiement ; test d’intrusion externe au lot 6.
- **Recette métier** : V3-01 à V3-12 et scénarios V6 (REC-007) réécrits en JUnit et Playwright Java, avec les mêmes identifiants.
- **Charge** : essai léger (Gatling) au niveau de l’hypothèse de dimensionnement de la section 1.
- **Couverture** : chaque règle de domaine et chaque règle d’autorisation possède au moins un test nommé ; aucun pourcentage global n’est imposé.
- **Intégration continue** : tous les tests et contrôles LIV-002 bloquent la fusion dans `main`.

## 7. Justification et contexte

- **Java et Spring (USR-24)** : écosystème mature et audité, supports longs. Spring Security fournit nativement la MFA par facteurs, les passkeys WebAuthn, les jetons à usage unique, la protection CSRF, les en-têtes et la gestion de session : le code de sécurité écrit à la main reste minimal.
- **Rendu serveur sans SPA (USR-24)** : aucune API à protéger en plus des pages, aucun droit calculé dans le navigateur, CSP stricte facile à tenir, aucune chaîne npm en production. La faible volumétrie ne justifie pas une SPA. Le moteur de geste du swipe ne dépend déjà pas de React (USR-22), ce qui permet de le porter en JavaScript natif.
- **FIDO2 (USR-24)** : résistant à l’hameçonnage et au rejeu ; aucun secret partagé n’est stocké côté serveur. Supprimer les mots de passe supprime aussi le bourrage d’identifiants et le stockage de mots de passe.
- **Instantané publié et RLS** : le risque principal de Glimlink est une fuite de données entre viviers ou vers l’entreprise. Une entreprise ne lit que des vues sans colonne privée, et PostgreSQL filtre les lignes : une erreur dans le code applicatif ne suffit pas à exposer une donnée.
- **CV anonymisé généré** : expurger un fichier source laisse des risques (calques, métadonnées, texte masqué). Générer le CV depuis la version publiée reprend le comportement de la maquette.
- **Monolithe modulaire** : un seul déploiement, une seule base, exploitation simple, adaptés à la volumétrie visée.
- **Scaleway** : PRO-008 et compte existant (ANAL-003).
- **Alternatives écartées** : Django (ANAL-005) et Node.js (ANAL-003), remplacés par la décision Java ; SPA React, surface plus large ; fournisseur d’identité externe (Keycloak), écarté car la MFA est demandée dans l’application, mais il reste une solution de repli si le besoin d’authentification grandit (fédération, SSO des écoles).

## 8. Dépendances et intégrations

### Systèmes externes

- **EXT-001** : navigateurs et authentificateurs FIDO2 des utilisateurs (plateforme ou clé matérielle). Les passkeys synchronisées dépendent du gestionnaire de l’utilisateur ; le fait d’exiger des clés matérielles pour les administrateurs est ouvert (ARB-021).

### Services tiers

- **SVC-001** : Scaleway Generative APIs, inférence LLM en région Paris, sans conservation des prompts selon le fournisseur (à vérifier contractuellement).
- **SVC-002** : Scaleway Transactional Email, envoi des invitations, liens de connexion et notifications.

### Dépendances d’infrastructure

- **INF-DEP-001** : Serverless Containers avec Private Network. Limite connue : pas de trafic entrant depuis le réseau privé, un seul réseau privé par conteneur ; le worker consulte la file et n’a pas besoin de trafic entrant.
- **INF-DEP-002** : Managed Database for PostgreSQL (accès privé, sauvegardes), Object Storage, Secret Manager, Container Registry, Cockpit.

### Dépendances de données

- **DAT-DEP-001** : référentiels de formations, compétences et calendriers saisis par l’administrateur (ARB-002, ARB-013) ; CV fournis par les conseillers.

### Plateformes techniques

- **PLT-001** : Java 25 LTS ; Spring Boot 4.1 ; Spring Security 7.1 avec le module WebAuthn ; Spring AI ; Thymeleaf ; Bootstrap 5.3 ; htmx 2 ; PostgreSQL managé ; Flyway. Versions vérifiées le 23 octobre 2026, à revérifier au lot 0.

### Conformité

- **COM-001** : RGPD : base légale, information des candidats sans compte, conservation, droits, AIPD (ARB-008).
- **COM-002** : AI Act : qualification de l’usage en recrutement (ARB-009).
- **COM-003** : souveraineté et éventuelle qualification SecNumCloud (PRO-008, ARB-011, AC-ARB-005).

## 9. Exemples et cas limites

Configuration WebAuthn indicative (API Spring Security, à vérifier contre la documentation 7.1) :

```java
http.webAuthn(webAuthn -> webAuthn
    .rpName("Glimlink")
    .rpId(properties.rpId())
    .allowedOrigins(properties.allowedOrigin()));
```

Politique RLS indicative pour les versions publiées lues par une entreprise :

```sql
ALTER TABLE student.student_publication ENABLE ROW LEVEL SECURITY;
CREATE POLICY company_reads_authorised_brands ON student.student_publication
  FOR SELECT
  USING (
    current_setting('app.role') <> 'company'
    OR brand_id IN (
      SELECT brand_id FROM company.company_brand_access
      WHERE company_id = current_setting('app.company_id')::uuid
    )
  );
```

Dans la réalisation, une politique distincte s’applique par rôle. Cet exemple ne montre que la branche entreprise.

Cas limites :

- **Passkey perdue par un conseiller** : il ne peut pas se connecter ; un administrateur réinitialise l’accès (AUT-008) et une nouvelle invitation d’enrôlement est envoyée. Les sessions et passkeys existantes sont révoquées.
- **Entreprise sans passkey qui change d’adresse e-mail** : la modification passe par le conseiller référent ; aucun lien n’est envoyé à la nouvelle adresse avant sa vérification.
- **Profil retiré pendant une session de swipe** : la décision suivante est refusée côté serveur et la carte disparaît au prochain fragment htmx (AUZ-005).
- **Deux conseillers qui corrigent la même fiche** : le second enregistrement échoue sur conflit de version et affiche les deux valeurs (PER-007).
- **Sortie IA qui invente une compétence non présente dans le CV** : `evidence` absente ou introuvable dans le texte source, la proposition est signalée « à vérifier » et n’est pas présélectionnée.
- **Besoin libre qui contient une injection de prompt** : la reformulation reste soumise à la confirmation de l’entreprise ; aucune contrainte calendrier n’est appliquée sans confirmation (V6 §6).
- **Navigateur sans JavaScript** : connexion par lien à usage unique possible pour l’entreprise ; WebAuthn exige JavaScript, ce qui est documenté pour conseillers et administrateurs.

## 10. Critères de validation

Avant l’ouverture de la production :

1. Critères AC-ARC-001 à AC-ARC-018 vérifiés et preuves archivées.
2. Scénarios V3-01 à V3-12 et V6 réussis en JUnit et Playwright Java.
3. Liste de contrôle ASVS 5.0 (ARC-007) renseignée ; écarts acceptés par écrit.
4. Test d’intrusion externe réalisé ; aucune vulnérabilité élevée ou critique ouverte.
5. Dossier PRO-008 (AC-ARB-005) complété pour chaque service de la section 3.8.
6. ARB-008 (conservation, AIPD) et ARB-021 (authentification des entreprises) décidés ; ARB-009 instruit.
7. Restauration de sauvegarde testée (AC-ARC-014).
8. Revue de cette spécification par l’équipe de réalisation ; les choix « Conception » acceptés ou modifiés sont consignés dans JOURNAL.md.

## 11. Spécifications liées

- [Accès, invitation et droits](spec-process-acces-droits.md)
- [Modèle de données et contrats de visibilité](spec-schema-donnees.md)
- [Fiche candidat, publication et CV](spec-data-candidats-cv.md)
- [Besoins, brief et matching explicable](spec-process-besoins-matching.md)
- [Ergonomie, sélecteurs et navigation mobile](spec-design-ergonomie-mobile.md)
- [Notifications et premier contact entreprise](spec-process-notifications.md)
- [Arbitrages, écarts et travaux de production](spec-process-arbitrages.md)
- [Recette fonctionnelle](spec-process-recette.md)
- Spring Security, MFA : https://docs.spring.io/spring-security/reference/7.1/servlet/authentication/mfa.html
- Spring Security, passkeys : https://docs.spring.io/spring-security/reference/7.0/servlet/authentication/passkeys.html
- Scaleway Generative APIs, confidentialité : https://www.scaleway.com/en/docs/generative-apis/reference-content/data-privacy/
- Scaleway Serverless Containers et Private Network : https://www.scaleway.com/en/docs/serverless-containers/reference-content/containers-private-networks/
- OWASP ASVS : https://owasp.org/www-project-application-security-verification-standard/
