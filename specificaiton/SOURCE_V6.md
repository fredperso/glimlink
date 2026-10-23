---
title: "Source fonctionnelle PDF V6 visuelle"
date_created: 2026-10-23
last_updated: 2026-10-23
status: source-archivee
---

# Source de référence — PDF V6 visuelle

Transcription textuelle de [Glimlink_Specifications_Fonctionnelles_Detaillees_V6_Visuelle-1.pdf](../Glimlink_Specifications_Fonctionnelles_Detaillees_V6_Visuelle-1.pdf), document « Spécifications fonctionnelles détaillées - V6 enrichie de maquettes » du 21 octobre 2026, 9 pages, déposé dans le dépôt le 23 octobre 2026. Le PDF reste la source originale. Les V4 et V5 citées par ses maquettes ne sont pas disponibles dans le dépôt.

SHA-256 du PDF : `afe7ea23048f617e03cb862209089b4c3dd7b784f031d31d8cccd2dc7b9df68a`.

Conventions de cette transcription :

- **[Surligné V6]** signale un passage surligné en jaune dans le PDF, c’est-à-dire un arbitrage V6 ou une évolution récente selon la note de lecture du document.
- Les deux planches de maquettes (pages 2 et 5) sont décrites, pas transcrites. Le document précise que **le texte des spécifications fait foi** sur les maquettes.
- Aucune évolution ultérieure de la maquette applicative n’est insérée ici.

---

Glimlink lit ce que le recruteur n’a pas le temps de lire, révèle ce qu’il pourrait ne pas voir, mais ne choisit jamais à sa place.

GLIMLINK — Spécifications fonctionnelles détaillées - V6 enrichie de maquettes. Parcours entreprise et conseiller - 21 octobre 2026.

**[Surligné V6]** Lecture : les arbitrages V6 et évolutions récentes sont surlignés en jaune. Les maquettes sont des visuels fonctionnels destinés à illustrer l’expérience cible ; le texte des spécifications fait foi.

## Vue d’ensemble visuelle - parcours V6

Planche de synthèse (page 2) : marque « Glimlink — Le lien qui révèle les talents », encart « Version V6 : l’IA n’invente jamais de contrainte calendrier ; parcours entreprise et conseiller détaillés ; maquettes d’écrans complètes ; toutes les dernières décisions intégrées ».

- Parcours entreprise en 7 étapes : décrire son besoin avec ses propres mots ; vérifier et compléter les informations (« Est-ce que j’ai bien compris votre besoin ? », missions 3 minimum, lieu du poste, formation suggérée, niveaux acceptés, type de contrat, prérequis permis/langue, disponibilité immédiate ou prochaine rentrée ; bloc « Présence obligatoire détectée » affiché seulement si l’entreprise a mentionné une contrainte) ; résultat du matching (« 23 profils à découvrir ») ; découvrir les profils en mode swipe ou grille (carte sans photo, « Pourquoi ce profil pour votre besoin ? », « En lien avec votre besoin », actions Passer / Voir son profil & son CV / Sélectionner) ; consulter le profil complet sans photo (onglets Vue d’ensemble, CV, Calendrier de formation ; CV anonymisé) ; vue grille sur le même vivier ; Ma sélection et demande de mise en relation (« À ce stade, Glimlink s’arrête et le conseiller reprend la main. Il n’y a pas de messagerie directe entre l’entreprise et l’étudiant »).
- Parcours conseiller en 5 étapes : préparer et valider les CV (aucune photo) ; extraction IA et validation ; gérer les entreprises et leurs besoins ; suivre les mises en relation ; suivre les profils placés et gérer les viviers.

Légende : « Maquette de synthèse : parcours entreprise et parcours conseiller. Aucune photo étudiante n’est prévue dans l’interface cible. »

## 1. Vision produit et principes

Glimlink est une plateforme B2B destinée aux écoles privées, CFA et centres de formation, mise à disposition de leurs entreprises partenaires. L’étudiant n’utilise pas l’application en V1/V6.

- Pas de CVthèque classique, jobboard ou CRM commercial complet.
- L’entreprise exprime simplement son besoin ; Glimlink le structure puis facilite la découverte.
- Le conseiller reste l’intermédiaire humain de la mise en relation.
- Aucun contact direct entreprise -> étudiant.

**[Surligné V6]** IA : elle peut déduire pour aider, mais ne doit jamais inventer pour décider. Elle priorise, contextualise et explique ; elle n’élimine pas un étudiant et n’affiche aucun score.

**[Surligné V6]** Aucune photo identifiable des étudiants dans les cartes, la grille ou la fiche détaillée.

## 2. Architecture et droits

Entreprise

- Accès sur invitation sécurisée ; pas d’inscription publique.
- Plusieurs besoins parallèles, chacun avec sa sélection et son historique.
- Accès à Mes besoins, Découvrir, Ma sélection, Talent Alerts et Mon profil.

Conseiller

- Accès uniquement à ses filières/viviers autorisés.
- Import, validation et mise à jour des CV.
- Invitation et accompagnement des entreprises.
- Réception des demandes de mise en relation et alertes de relais humain.

Administrateur

- Configuration campus, marques, formations, calendriers, droits et règles d’isolation.
- Architecture : Organisation -> Campus -> Écoles/Marques -> Formations -> Talents.

## 3. Parcours entreprise - accès et profil

- Le conseiller envoie un lien sécurisé.
- L’entreprise active son espace et valide son e-mail.
- Données : raison sociale, SIRET, adresse(s)/site(s), secteur, contact et coordonnées professionnelles.
- Le conseiller peut précréer l’espace et un premier besoin puis transmettre le lien.

**[Surligné V6]** À l’activation de l’entreprise, le conseiller référent reçoit une notification afin de pouvoir appeler l’entreprise, présenter Glimlink et qualifier ses besoins.

**[Surligné V6]** Multi-sites : la fiche entreprise peut porter plusieurs lieux. Pour chaque besoin, le lieu du poste est prérempli mais reste modifiable.

## 4. Parcours entreprise - expression libre du besoin

**[Surligné V6]** La première action est une phrase libre. Aucun formulaire complexe ne précède cette étape.

Exemple : « Je recherche quelqu’un pour faire de l’administratif, gérer un portefeuille clients et effectuer des relances commerciales. »

CTA : Comprendre mon besoin.

## 5. Reformulation IA - « Est-ce que j’ai bien compris ? »

**[Surligné V6]** Le matching ne démarre qu’après confirmation du brief par l’entreprise.

- Intitulé proposé automatiquement par l’IA et modifiable.
- Au moins 3 missions avant validation.
- Compétences déduites des missions, supprimables/ajoutables.
- Lieu obligatoire : prérempli depuis la fiche entreprise, modifiable selon le site concerné.
- Type de contrat : Alternance/CPRO ou Stage.
- Formation suggérée par l’IA à partir des missions.
- Niveaux acceptés : Bac+2, Bac+3, Bac+5, choix multiple.
- Permis : contrainte forte seulement si obligatoire.
- Langue/niveau : pris en compte si exprimé ou confirmé.
- Disponibilité : besoin immédiat ou prochaine rentrée.

**[Surligné V6]** Les cases de compétences ne sont pas l’unique source du matching : l’IA continue à comprendre sémantiquement les missions et le contexte global.

## 6. Règle calendrier

**[Surligné V6]** Glimlink n’invente jamais une contrainte calendrier. Si l’entreprise ne mentionne aucun jour de présence obligatoire, aucun filtre calendrier n’est appliqué.

**[Surligné V6]** Si elle écrit « présence obligatoire le jeudi », l’IA détecte cette exigence, l’affiche dans la reformulation et demande confirmation. Après validation seulement, elle compare cette contrainte aux calendriers de formation.

Le calendrier reste consultable sur chaque profil, qu’il ait servi ou non au matching.

## Maquettes - besoin, reformulation, matching et découverte

Planche (page 5), sous-titre « Matching intelligent • Simple • Responsable • Sans biais », encart « V6 – Évolutions clés : aucune photo des étudiants ; contrainte calendrier uniquement si exprimée ; plus de visibilité avec des maquettes d’écrans ; parcours entreprise et conseiller détaillés ». Huit écrans : (1) « Quel profil recherchez-vous ? », phrase libre et bouton « Comprendre mon besoin » ; (2) « Est-ce que j’ai bien compris votre besoin ? » avec missions et compétences, lieu du poste, formation suggérée, niveaux acceptés, prérequis, disponibilité, boutons « Modifier ma demande » et « Oui, c’est bien ça » ; (3) contrainte calendrier détectée (« Jeudi ») ou, en l’absence de contrainte, mention que le bloc n’apparaît pas ; (4) « 23 profils à découvrir », « Découvrir les profils », « Voir en grille », « Ma sélection » ; (5) swipe sans score, « Pourquoi Camille pour votre besoin ? », « Ce qui ressort », « En lien avec votre besoin » (mission → « Expérience identifiée »), « Passer » ne signifie jamais « refuser » ; (6) « Le Déclic Glimlink » : après plusieurs correspondances évidentes, un profil moins attendu s’il existe une vraie raison ; (7) profil détaillé avec onglets Profil / CV / Calendrier, « Lecture Glimlink », CV anonymisé (« Ouvrir le CV (PDF) »), calendrier consultable même si aucune contrainte n’a été exprimée ; (8) vue grille paginée sur le même vivier et Ma sélection avec « Demander une mise en relation ».

Légende : « Exemples fonctionnels des principaux écrans entreprise. Les photos éventuellement suggérées par des maquettes antérieures sont supprimées de la V6 cible. »

## 7. Matching et ordre de présentation

Le moteur maintient une pertinence interne pour organiser la découverte. Aucun pourcentage ou score n’est visible.

- Missions et expériences comparables.
- Compétences explicites et proximité sémantique.
- Compétences transférables justifiables.
- Niveau accepté/exigé.
- Lieu et mobilité disponibles.
- Permis/langue si réellement requis.
- Disponibilité.
- Calendrier seulement si contrainte exprimée.
- Signal humain facultatif du conseiller.

**[Surligné V6]** Les évidences d’abord, les découvertes intelligentes ensuite. Les profils les plus directement alignés apparaissent en priorité. Un profil Déclic ne doit jamais déplacer artificiellement un profil objectivement plus proche.

**[Surligné V6]** Aucun rejet automatique : tous les profils autorisés restent accessibles dans la vue globale.

## 8. Lecture personnalisée et Déclic Glimlink

**[Surligné V6]** Pour chaque profil et chaque besoin, Glimlink distingue : ce que le CV prouve, ce qui peut raisonnablement être transféré, puis pourquoi cela peut servir les missions de cette entreprise.

**[Surligné V6]** Le Déclic Glimlink est réservé aux passerelles réellement explicables. Il ne transforme jamais une supposition en compétence certaine.

Une même candidate peut donc être expliquée différemment à deux entreprises, sans modifier les faits sources de son CV.

## 9. Expérience de découverte

**[Surligné V6]** Trois espaces seulement : Découvrir (swipe), Voir en grille / Tous les profils, Ma sélection. Swipe et grille contiennent le même vivier.

Carte swipe

- Prénom, formation, zone géographique large ; aucune photo.
- « Pourquoi ce profil pour votre besoin ? » en 2-3 phrases.
- 3-4 éléments factuels qui ressortent du parcours.
- Bloc « En lien avec vos missions ».
- Déclic Glimlink seulement si utile.
- Actions : Passer, Voir le profil/CV, Sélectionner.

**[Surligné V6]** Passer ≠ refuser. Le profil reste accessible dans la grille.

Fiche détaillée

- Lecture Glimlink personnalisée.
- CV anonymisé rapidement accessible.
- Calendrier de formation.
- Disponibilité et éléments pertinents.
- Nom, téléphone, e-mail et adresse précise de l’étudiant masqués.

## 10. Ma sélection et mise en relation

- Sélection sans plafond.
- Sélection indépendante par besoin.
- CTA final : Demander une mise en relation.
- Aucune coordonnée étudiante révélée.

À ce stade, le conseiller reprend la main : contact entreprise, conseil sur les profils, contact étudiants et organisation des entretiens.

## 11. Relais humain si aucune sélection

**[Surligné V6]** Si l’entreprise ne trouve personne, Glimlink propose l’intervention du conseiller plutôt que de conclure à l’absence de candidats.

« Vous n’avez pas encore trouvé le profil recherché ? Votre conseiller peut affiner votre besoin avec vous et vous proposer d’autres pistes. »

**[Surligné V6]** Le conseiller reçoit une alerte et reprend le besoin avec l’entreprise.

## 12. Talent Alerts

- Besoin actif.
- Nouveau profil pertinent : notification in-app + e-mail.
- Lien direct vers le profil/besoin.
- Pas de fréquence quotidienne/hebdomadaire à paramétrer en V1.

## 13. Parcours conseiller - tableau de bord

- CV/étudiants gérés par filière.
- CV en ligne.
- Demandes de mise en relation.
- Besoins entreprises du périmètre.
- Entreprises accessibles selon droits.
- Alertes : nouvelle entreprise, mise en relation, non-sélection.

**[Surligné V6]** Le conseiller ne voit jamais automatiquement les CV des autres conseillers ou marques.

## 14. Parcours conseiller - création du profil étudiant

1. Importer le CV.
2. Extraction IA des expériences, missions, compétences, langues et autres données utiles.
3. Validation/correction obligatoire par le conseiller avant publication.
4. Association automatique de la formation et du calendrier.
5. Modification et remplacement du CV à tout moment.
6. Publication dans le vivier autorisé.

**[Surligné V6]** Aucun compte étudiant n’est nécessaire.

## 15. Parcours conseiller - connaissance humaine

**[Surligné V6]** Après entretien, le conseiller peut facultativement saisir des observations factuelles : aisance orale observée, posture, maturité du projet, écoute, argumentation, etc.

**[Surligné V6]** Un signal interne « profil à valoriser / pépite » peut être utilisé exceptionnellement. Il reste invisible à l’entreprise.

**[Surligné V6]** L’IA peut intégrer ces éléments dans une formulation neutre, sans les transformer en certitudes.

## 16. Parcours conseiller - entreprise et besoin

1. Inviter l’entreprise ou préparer son espace.
2. Être notifié lors de l’activation.
3. Accompagner l’entreprise si nécessaire.
4. Conserver le référent relationnel initial.
5. Router le besoin validé vers le conseiller responsable de la formation/niveau concerné.

**[Surligné V6]** Un même campus peut contenir des filières concurrentes : on partage l’opportunité, pas les viviers.

## 17. Parcours conseiller - mise en relation

La demande affiche : entreprise, contact, besoin validé, profils sélectionnés, CV et date.

**[Surligné V6]** Suivi volontairement léger : action « Mise en relation effectuée ». Ne pas recréer un CRM complet.

Le conseiller contacte les parties et organise les entretiens. Les explications sensibles ou refus importants restent humains.

## 18. Cycle de vie étudiant

- Visible pendant un ou plusieurs entretiens.
- Retrait manuel du vivier lorsqu’il est placé.
- Mise à jour/réactivation possible.
- Historique minimal sous réserve des règles RGPD à définir.

## 19. Règles métier V6 - synthèse

| Sujet | Règle |
| --- | --- |
| Photo étudiant | Aucune photo identifiable |
| Score | Interne uniquement |
| Profils | Tous les profils autorisés restent accessibles |
| Ordre | Pertinence la plus forte d’abord |
| Déclic | Ponctuel, justifié |
| Missions | 3 minimum avant validation |
| Lieu | Obligatoire, prérempli, modifiable |
| Calendrier | Seulement si contrainte exprimée |
| Permis/langue | Fort si requis |
| Disponibilité | Immédiat / prochaine rentrée |
| CV | Anonymisé et accessible |
| Conseiller | Signal humain facultatif et invisible |
| Passer | Profil suivant, pas rejet |
| Contact étudiant | Jamais visible entreprise |

## 20. Hors périmètre

- Pas de messagerie entreprise -> étudiant.
- Pas de prospection/CRM commercial complet.
- Pas de dépôt d’offre obligatoire.
- Pas de CDI dans le périmètre actuel.
- Pas de score public.
- Pas de soft skill inventée par l’IA.
- Pas de filtre RQTH automatique.
- Pas de rubrique visible « Pépite/Regard conseiller ».

## 21. Points à arbitrer avec le développeur

- Pondération exacte du moteur interne.
- Règles d’exposition à pertinence comparable.
- Seuil de déclenchement du relais après non-sélection.
- Modèle des observations conseiller et traçabilité.
- Gestion technique des multi-sites.
- Politique RGPD, consentement et conservation.
- Anonymisation technique des CV.
- Audit/correction des extractions IA.
- Permissions inter-marques et intégrations éventuelles.

## 22. Priorités de développement

1. Invitation sécurisée et profil entreprise multi-sites.
2. Phrase libre et reformulation IA.
3. 3 missions minimum, compétences, lieu, contrat, niveaux, permis/langue, disponibilité.
4. Calendrier uniquement si exprimé.
5. Import CV + extraction + validation conseiller.
6. Moteur interne sans score visible.
7. Lecture personnalisée + Déclic.
8. Signal conseiller interne.
9. Swipe sans photo + grille.
10. CV anonymisé + calendrier.
11. Sélection + mise en relation.
12. Routage conseiller et relais humain.
13. Talent Alerts.

Parcours entreprise : besoin libre -> reformulation -> validation -> matching -> découverte -> CV/calendrier -> sélection -> mise en relation.

Parcours conseiller : préparer le vivier -> valider les CV -> accompagner les entreprises -> recevoir/router les besoins -> mettre en relation -> suivre les profils placés.
