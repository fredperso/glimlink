# Audit de la maquette Glimlink V1

La lecture actuelle des règles est consolidée dans [specificaiton/README.md](../specificaiton/README.md). Cet audit conserve ses constats et corrections historiques ; les décisions plus récentes sont dans les spécifications thématiques.

Audit du 7 octobre 2026, fondé sur `Glimlink_Specifications_Fonctionnelles_Detaillees_V3.pdf`, les composants React, le modèle métier et les tests existants. V3 désigne la révision des spécifications ; la cible reste le MVP/V1.

Cette revue distingue les écarts observables dans la maquette, les fonctions techniques volontairement simulées et les décisions encore ouvertes en §20. Elle ne constitue pas une nouvelle recette visuelle ou un audit de sécurité. Aucun comportement applicatif n’a été modifié.

**Conclusion : les principaux parcours sont représentés, mais plusieurs informations affichées et transitions métier restent incomplètes. La maquette ne démontre pas encore toute la V1.** Les priorités sont le brief réellement validé, la mobilité, le périmètre conseiller et le repérage des corrections en attente.

## État après correction

Les constats ci-dessous décrivent la version auditée avant correction. **A01 à A10 sont traités dans la maquette** : brief confirmé partagé, mobilité renseignable, périmètres et compteurs filtrés, corrections en attente repérables, calendrier entreprise mois/année avec disponibilités individuelles, aide contextualisée et chiffrée, comparaison depuis la demande, entreprises reliées aux besoins, compétences/domaines du brief et identité du validateur.

Les demandes nouvelles conservent une version du brief, des disponibilités et des calendriers au moment de leur création. Une demande ancienne sans cette référence affiche une réserve explicite. Les notes de suivi conseiller sont privées dans la projection entreprise. Les invitations et activations sont désormais persistantes dans le navigateur ; leur vérification et les envois restent simulés. Un sélecteur permet de parcourir les comptes fictifs ; une initialisation neuve comprend un besoin distinct pour Bloom Studio. Les sauvegardes existantes sont conservées.

**Validation après correction :** 34 tests métier réussis ; les 10 nouveaux parcours ont été testés à 1 440, 390 et 320 px. Les fonctions techniques simulées et les arbitrages de §20 restent ouverts. Voir `VALIDATION.md` et `SPEC_COVERAGE.md`.

## 1. Écarts à traiter dans la maquette

P1 : information potentiellement trompeuse ou défaut de périmètre. P2 : parcours incomplet. P3 : amélioration de lisibilité ou de traçabilité. Ces priorités concernent la revue du prototype, pas une classification de vulnérabilités de production.

### A01 — Le conseiller ne reçoit pas toutes les corrections du brief — P1

**Référence : §4.3 et §10.** L’entreprise peut modifier les missions du brief. Les vues « Besoins partenaires » et « Brief validé et contact entreprise » utilisent pourtant `need.description`, le texte initial, au lieu d’afficher les missions corrigées (`need.missions`). Les jours et le permis sont actualisés, mais les missions et les critères souhaitables ne sont pas présentés intégralement dans ces vues.

**Exemple reproductible :** décrire une mission d’accueil, remplacer les missions proposées par « Suivre les commandes », puis confirmer. Le conseiller continue de lire la description d’accueil sous un intitulé de brief validé.

**Attendu :** une présentation commune du brief confirmé — missions, souhaitables, lieu, dates et contraintes — dans les deux espaces. Conserver la description originale comme source explicitement identifiée.

**Code :** `src/components/NeedBuilder.tsx`, `src/components/Adviser.tsx` fonction `Needs`, `src/components/Company.tsx` fonction `RequestList`.

### A02 — La mobilité est affirmée sans donnée correspondante — P1

**Référence : §4.2, §5.1, §7 et annexe A.** Chaque fiche entreprise affiche « Mobilité locale ». Aucun champ de mobilité n’existe dans `StudentDetails`, et le conseiller ne peut pas renseigner cette information. Le lieu de résidence et le permis ne suffisent pas à la déduire. Le besoin ne porte pas non plus de contrainte structurée de mobilité.

**Attendu :** représenter une mobilité renseignée ou « À vérifier », éditable par le conseiller ; prévoir son équivalent dans le brief. Son effet sur le matching devra être arbitré.

**Code :** `src/components/Modals.tsx` fonction `Profile`, `src/domain/model.ts` types `StudentDetails` et `Need`.

### A03 — Le tableau de bord conseiller ne filtre pas partout son périmètre — P1

**Référence : §2.2, §13, §15 et V3-12.** Les étudiants et formations du tableau de bord sont filtrés sur `campus-a`, mais le nombre de demandes compte toutes les demandes reçues et la section des besoins affiche tous les besoins actifs. Les pages détaillées appliquent d’autres filtres. Avec les données principales du même campus, cette incohérence est peu visible.

**Exemple :** ajouter une demande et un besoin appartenant uniquement à un autre établissement : les indicateurs ou besoins du tableau de bord peuvent les intégrer.

**Attendu :** centraliser le périmètre autorisé et l’appliquer aux compteurs, listes, détails et actions. Les tests actuels de visibilité des profils ne couvrent pas ce tableau de bord.

**Code :** `src/components/Adviser.tsx` fonction `Home`, `src/components/Company.tsx` fonction `RequestList`.

### A04 — Les corrections en attente d’un profil publié sont difficiles à retrouver — P2

**Référence : §13, §14.2–14.4.** Enregistrer une correction sans publier conserve correctement la version entreprise. Cependant le candidat garde son statut `published`. Les compteurs, filtres et aperçus « Brouillons à vérifier » ne retiennent que le statut `draft` : ils ne signalent pas un profil publié dont la version de travail a changé. La liste peut afficher les nouvelles valeurs du brouillon avec le badge « Publié ».

**Attendu :** distinguer le statut de publication de l’existence de corrections en attente ; proposer un badge et un filtre adaptés, ainsi qu’une comparaison avant publication. Le compteur « Brouillons à vérifier » devrait également ouvrir la liste filtrée, plutôt que tous les étudiants.

**Code :** `src/domain/model.ts` fonction `saveDraft`, `src/components/Adviser.tsx` fonctions `Students` et `Home`.

### A05 — La lecture entreprise du calendrier reste hebdomadaire — P2

**Référence : §6.4 et extension demandée sur les vues mois/année.** Les vues détaillées et exceptions sont disponibles côté conseiller. La fiche entreprise montre seulement le rythme hebdomadaire de référence. Elle indique bien la période du calendrier et avertit de l’existence d’exceptions, mais ne permet pas de consulter leurs dates.

**Exemple :** une exception de cours le vendredi produit correctement un conflit dans les contrôles, alors que la grille hebdomadaire conserve « Dispo.* » le vendredi. Le texte explicatif atténue cette ambiguïté sans la résoudre visuellement.

**Attendu :** permettre une lecture datée sur la période du besoin, ou afficher les exceptions pertinentes à côté du rythme de référence. Les vues mensuelles et annuelles côté entreprise sont une proposition ergonomique ; elles ne sont pas explicitement imposées par le PDF.

**Code :** `src/components/ui.tsx` fonction `Week`, `src/components/Modals.tsx` fonction `Profile`, `src/components/CalendarViews.tsx`.

### A06 — L’accompagnement d’une recherche sans résultat reste générique — P2

**Référence : §9.** L’écran propose de revoir les jours ou le permis et de contacter Mathilde. Il n’explique pas précisément les blocages du besoin courant et ne calcule pas combien de profils deviendraient compatibles après un assouplissement, même lorsque les données locales permettent de calculer les effets des contraintes de calendrier et de permis.

**Attendu :** proposer des hypothèses contextualisées, avec des comptes limités au vivier autorisé et une indication des autres réserves. L’entreprise doit confirmer toute modification ; aucun assouplissement automatique.

**Code :** `src/components/Company.tsx`, état vide de la découverte.

### A07 — Les changements depuis la demande ne sont pas identifiés comme tels — P2

**Référence : §10.** Le conseiller voit les conflits actuels et les profils retirés : cette couverture est utile. Mais la demande conserve seulement les identifiants des profils et du besoin. Sans version de référence au moment de la demande, la maquette ne distingue pas une réserve déjà connue d’un changement de disponibilité intervenu ensuite ; une évolution du brief remplace aussi son contexte initial.

**Attendu :** conserver une référence de version et signaler les changements pertinents avant la prise de contact. La profondeur de l’historique et les transitions restent à valider en §20.

**Code :** `src/domain/model.ts` types `Request` et `Need`, fonction `requestSelection` ; `src/components/Company.tsx` fonction `RequestList`.

### A08 — Les entreprises et conseillers ne sont pas réellement reliés aux parcours — P2

**Référence : §3, §10, §15 et annexe A.** Les six partenaires sont consultables et contactables, mais les besoins et demandes affichent systématiquement Maison Alba/Camille Martin. Aucun `companyId` ne relie un besoin à son entreprise et aucun conseiller responsable n’est rattaché au candidat. Mathilde est le contact global. Une invitation simulée ne crée pas de partenaire persistant.

**Attendu pour une démonstration représentative :** deux entreprises avec des besoins distincts et une attribution explicite au conseiller responsable. Le routage de sélections multi-marques reste un arbitrage §20 ; il ne faut pas inventer sa règle définitive.

**Code :** `src/domain/model.ts`, `src/domain/partners.ts`, `src/components/Adviser.tsx`, `src/components/Company.tsx`, `src/components/Modals.tsx` fonction `Invitation`.

### A09 — Certaines informations du brief n’ont pas de représentation éditable — P2

**Référence : §4.2–4.3.** Les missions, dates, lieu, jours, permis et souhaitables sont éditables. Les compétences explicites/suggérées et les domaines ou formations proposés ne disposent pas de représentation dédiée. Il est possible de les écrire en texte libre, mais pas de vérifier séparément ces propositions ni leur provenance.

**Attendu :** montrer les compétences proposées et leurs liens aux missions, avec confirmation ou suppression. Les formations pertinentes doivent rester des suggestions, sans imposer le choix d’une filière à l’entreprise.

**Code :** `src/components/NeedBuilder.tsx`, `src/domain/model.ts` type `Need`.

### A10 — L’identité du validateur manque — P3

**Référence : annexe A, règle de données proposée.** La date de validation est conservée, mais pas l’identité du conseiller ayant validé. Le commentaire affiche Mathilde de façon fixe. Cela ne représente pas une future délégation ou un changement de conseiller.

**Attendu :** mémoriser le validateur et l’afficher avec la date. La granularité du journal d’actions reste ouverte en §20.

**Code :** `src/domain/model.ts` type `Student` et fonction `publishStudent`, `src/components/Modals.tsx` fonction `Profile`.

## 2. Fonctions simulées : acceptables pour la maquette, à réaliser pour la V1

| Fonction prévue                                    | État actuel                                                                             | Limite de la démonstration                                                                                                                                                                             |
| -------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Extraction du besoin et matching sémantique (§4–5) | Mots-clés, dates prédéfinies et scores par profil/type de contrat ; simulation signalée | Les corrections des missions, compétences, niveaux et localisation ne recalculent pas le score. « Pourquoi ça matche ? » ne démontre pas de correspondances précises mission/expérience ni les écarts. |
| Import et versions de CV (§7, §14)                 | Nom du fichier choisi, préremplissage fictif, aperçu généré depuis la fiche             | Pas de lecture, fichier source conservé, version expurgée ou comparaison source/propositions/corrections ; erreurs d’extraction non illustrées.                                                        |
| Invitation, authentification et droits (§3, §15)   | Parcours simulé, changement de rôle, stockage local                                     | Pas de session authentifiée ni de séparation effective des données entre utilisateurs. Les autorisations de vivier entreprise ne sont pas indépendantes des besoins.                                   |
| Notifications (§11, §16)                           | Alertes dans le stockage local                                                          | Pas d’e-mails de validation, de nouveaux talents ou de demandes envoyés, ni de traitement d’erreur d’envoi.                                                                                            |
| Mise en relation (§10)                             | Demande et trois états de suivi                                                         | Pas de scénario complet de prise de contact et d’organisation d’entretien. Un parcours illustratif suffit ; un agenda ou un CRM complet n’est pas exigé.                                               |

La projection entreprise exclut correctement les champs privés structurés. En revanche, elle transmet les textes publics tels quels : une coordonnée saisie dans une expérience ou un commentaire ne serait pas expurgée. Les contrôles de publication, des vrais documents et des futures API restent à concevoir. La maquette autonome contient les données fictives des deux rôles ; elle ne prouve pas la confidentialité en production.

## 3. Points à arbitrer, sans les présenter comme des exigences approuvées

- **Formation/promotion/groupe :** le modèle confond encore formation et calendrier. La sélection d’une promotion ou d’un groupe et une filière structurée ne sont pas démontrées (§6.1–6.2). Le niveau exact, les rattachements multiples et les droits de création restent ouverts.
- **Administration des formations :** modification des calendriers existants disponible ; création de formation et édition des objectifs de compétences absentes. Qui peut le faire doit être décidé (§20).
- **Compatibilité :** traitement des inconnues, exclusions, pondération, éligibilité des conflits et contribution des niveaux/acquisitions restent à valider. L’échelle de compétences ajoutée à votre demande n’est pas un référentiel validé par le PDF.
- **Alertes :** seules les premières publications classées dans le flux principal créent une alerte ; les profils « À découvrir » n’en créent pas. Clarifier leur éligibilité, ainsi que modification, republication et déduplication (§11, §20).
- **Cycles de vie :** états détaillés des demandes, reprise d’un besoin fermé, profils retirés, modifications après sélection et conservation de l’historique.
- **CV et protection :** formats, contrôle de la version entreprise, droits des étudiants sans compte, conservation, suppression et journalisation.
- **Exploitation et pilote :** hébergement, sauvegardes, volumes, critères de recette et jeu de cas évalué par l’expert métier.

Les demi-journées, l’âge affiché, les intégrations CRM/ERP/ATS, un compte étudiant et un ATS complet ne doivent pas être ajoutés comme des manquements V1 obligatoires : ils sont ouverts, différés ou exclus du périmètre décrit.

## 4. Couverture déjà acquise et validation

La maquette représente la confirmation obligatoire du brief, plusieurs besoins, les sélections par besoin, les demandes, les alertes locales, la découverte et les fiches. Elle conserve la version publiée lors d’une correction non validée, distingue permis inconnu et absence de permis, partage les calendriers, contrôle les contraintes individuelles et retire les profils de la découverte. Le conseiller peut modifier les coordonnées privées sans publier les corrections professionnelles. Les compétences peuvent être ajoutées/supprimées, recevoir un niveau et être distinguées entre acquises et en acquisition ; les objectifs de formation sont visibles.

**Contrôle exécuté lors de cet audit :** `rtk npm test` — **28 tests réussis, aucun échec**, incluant V3-01 à V3-12 et les extensions calendriers/compétences. Ces tests vérifient le modèle local ; V3-11/V3-12 ne démontrent pas la sécurité d’API ou de fichiers qui n’existent pas encore. L’annexe B demande aussi la recette des parcours antérieurs et un jeu de besoins/candidats évalué par l’expert métier.

## 5. Ordre de reprise proposé

1. Corriger A01–A03 : brief commun validé, mobilité connue/inconnue et périmètre uniforme.
2. Rendre visibles les corrections en attente et les dates pertinentes du calendrier (A04–A05).
3. Compléter l’aide sans résultat et le signalement des changements (A06–A07).
4. Démontrer deux entreprises réellement reliées aux demandes, puis compléter le brief et le validateur (A08–A10).
5. Valider les décisions §20 avant de transformer les simulations en services de production.

La table de `SPEC_COVERAGE.md` indique une représentation globale des thèmes, pas leur complétude. Lire cet audit en complément évite notamment d’assimiler le routage fixe, l’aide générique et les contrôles locaux à une couverture intégrale de la V1.
