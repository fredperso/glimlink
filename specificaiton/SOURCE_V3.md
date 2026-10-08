---
title: "Source fonctionnelle PDF V3"
date_created: 2026-10-08
last_updated: 2026-10-08
status: source-archivee
---

# Source de référence — PDF V3

Transcription textuelle de [Glimlink_Specifications_Fonctionnelles_Detaillees_V3.pdf](../Glimlink_Specifications_Fonctionnelles_Detaillees_V3.pdf), document du 7 octobre 2026, 13 pages. Le PDF reste la source originale. Le texte ci-dessous ne contient pas les évolutions ultérieures de la maquette. Les tableaux du PDF sont conservés sous forme de texte aligné ; les spécifications thématiques les structurent et les complètent.

SHA-256 du PDF : `2af1d0a8af47b3bb29fb537ea30dc36ad0bf4f94485c703dc478344df16d52de`.

La révision **V3 du document** concerne le logiciel **MVP/V1**.

GLIMLINK
Spécifications fonctionnelles détaillées
MVP / Version logicielle V1 • 7 octobre 2026

Mission : faciliter le recrutement d’alternants et de stagiaires pour les entreprises partenaires d’un
centre de formation, grâce à un accès intelligent et accompagné à son vivier de talents.

Principe produit
L’application matche. L’entreprise choisit. Le conseiller accompagne.

Glimlink constitue une couche de découverte et de recrutement. Il n’a pas vocation à remplacer le
CRM, l’ERP ou l’ATS du centre de formation.

Évolutions intégrées dans cette version
- Une fiche étudiant structurée en base de données devient la référence utilisée par le matching.
- Le CV préremplit la fiche ; le conseiller corrige, enrichit et valide les informations avant publication.
- Le rattachement à une formation ou à une promotion associe automatiquement son calendrier.
- Les jours potentiellement disponibles en entreprise sont déterminés à partir des cours, de la période
de recherche et des indisponibilités individuelles connues.
Cette V3 reprend le périmètre de la V2 et détaille ces évolutions. La numérotation des 20 sections est conservée.
Deux annexes précisent les données et les scénarios de recette.

La version 3 du document ne correspond pas à une V3 du logiciel : le périmètre visé reste le MVP / V1. Les arbitrages
non résolus sont regroupés en section 20.

## 1. Vision produit et différenciation
La réussite ne repose pas sur le seul matching IA, mais sur l’expérience entreprise et son adaptation
aux réalités de l’alternance. Glimlink transforme le vivier étudiant en service de recrutement pour les
partenaires du centre.

### 1.1 Trois piliers prioritaires
- Comprendre un besoin exprimé librement, sans exiger une offre ni la connaissance des diplômes.
- Matcher selon les compétences, expériences, formation, mobilité, disponibilité et calendrier de
cours.
- Faire découvrir : expliquer les correspondances et l’intérêt de profils moins évidents.

### 1.2 Limites du produit
Glimlink ne devient ni un CRM commercial ou de prospection, ni un logiciel d’admission, de
contractualisation / Cerfa ou de suivi pédagogique. Il ne se réduit pas à un jobboard ou une CVthèque
avec un score IA, et ne permet pas de contourner le conseiller.

### 1.3 Promesse UX
Une TPE/PME décrit ses missions, comprend les résultats, choisit les talents à rencontrer et laisse le
conseiller organiser la relation, sans devoir maîtriser le catalogue de formations.

## 2. Utilisateurs et rôles
### 2.1 Entreprise partenaire
- Accès sur invitation sécurisée ; compte gratuit avec un seul utilisateur en V1.
- Expression de plusieurs besoins, découverte autonome et sélections libres.
- Demande de mise en relation sans coordonnées personnelles des étudiants ; réception de Talent
Alerts sur les besoins actifs.

### 2.2 Conseiller de formation
- Rattaché à un établissement et à un périmètre de droits ; invite les entreprises.
- Dépose les CV, contrôle et enrichit les fiches étudiants, puis les publie.
- Connaît le planning des cours ; renseigne ou vérifie le calendrier et rattache chaque étudiant à la
formation / promotion pertinente.
- Consulte les coordonnées complètes dans son périmètre, traite les demandes, contacte les
étudiants et organise les entretiens.
- Actualise les disponibilités et retire les étudiants placés.

### 2.3 Étudiant
Aucun compte étudiant en V1. Le centre gère les données et leur actualisation. Les modalités
d’information, de correction, de conservation et de protection sont à formaliser en section 20.

## 3. Accès et compte entreprise
- Aucune inscription publique ; invitation générée / envoyée par le conseiller.
- Validation obligatoire de l’adresse e-mail professionnelle.
- Données minimales : raison sociale, SIRET, adresse, secteur, contact principal, fonction, téléphone
et e-mail professionnel.
- Plusieurs besoins actifs possibles sur un même compte.
La durée de validité, la révocation et le renouvellement des invitations restent à définir. Les accès aux
profils sont limités aux viviers autorisés pour l’entreprise.

## 4. Compréhension naturelle du besoin
### 4.1 Entrée principale
Le parcours commence par « Que recherchez-vous ? », sans imposer le dépôt d’une offre.

Exemple de besoin
« J’ai besoin de quelqu’un pour accueillir mes clients, gérer des devis et m’aider sur l’administratif.
Il faudrait qu’il soit présent le vendredi et qu’il ait le permis. »

### 4.2 Extraction intelligente
- Type de contrat, missions, compétences explicites et besoins de compétences suggérés par les
missions.
- Domaine et formations potentiellement pertinentes.
- Contraintes obligatoires et critères souhaitables, notamment permis et présence certains jours.
- Localisation / mobilité, date de début et période de recherche lorsqu’elles sont mentionnées.
L’IA rapproche sémantiquement les formulations. Une mission n’a pas besoin de reprendre les mots du
CV. Les éléments implicites restent des propositions dans le brief, à confirmer par l’entreprise.

### 4.3 Brief validé
Le logiciel reformule le besoin dans un brief lisible et structuré. L’entreprise peut corriger chaque
élément, notamment les jours obligatoires et les dates. Aucun matching ne démarre avant sa
validation explicite, par exemple « C’est exactement ça ».

### 4.4 Recherche transversale
L’entreprise n’est pas obligée de choisir une formation. Le moteur peut rechercher dans plusieurs
formations et viviers autorisés, selon les missions exprimées. Les modifications ne deviennent pas des
préférences permanentes ; chaque nouveau besoin repart de zéro.

## 5. Matching spécialisé alternance
### 5.1 Source des données
La fiche étudiant validée constitue la référence du matching. Le moteur utilise les informations
structurées et les contenus descriptifs validés : formation / filière, compétences, expériences, mobilité,
permis, localisation générale, disponibilité et calendrier associé.

Le CV sert à l’alimentation initiale et à la consultation autorisée. Il n’est pas réinterprété à chaque
recherche pour remplacer les corrections du conseiller. Les champs inconnus restent identifiables
comme tels.

### 5.2 Contrôles et rapprochement sémantique
- Les droits d’accès au vivier sont vérifiés avant toute exposition d’un profil.
- Les contraintes de calendrier sont contrôlées par des règles explicites sur des données structurées.
- Le rapprochement sémantique sert à évaluer les missions, compétences et expériences
transférables.
- Les critères obligatoires restent distincts des souhaitables. Une information inconnue n’est pas
assimilée automatiquement à une réponse négative.
La conséquence d’une contrainte non satisfaite ou inconnue sur l’éligibilité, le classement et la zone «
À découvrir » doit être validée avec l’expert métier. Le moteur ne doit pas dissimuler une
incompatibilité connue.

### 5.3 Score et seuil
Un score de compatibilité est calculé pour un couple étudiant / besoin. Le seuil du flux principal
reste fixé à 60 % en V1. Ce score n’est ni une qualité intrinsèque du candidat, ni une probabilité de
recrutement.

La pondération, le traitement des inconnues et les exclusions sont à définir avec l’expert métier, puis à
tester sur des cas réels. Les critères souhaitables ne doivent pas compenser silencieusement une
contrainte explicitement obligatoire.

### 5.4 Explication du résultat
Chaque fiche détaillée comporte « Pourquoi ça matche ? » : correspondances documentées,
compétences transférables, écarts, conflits et informations à vérifier. L’explication s’appuie sur les
données validées et les résultats des contrôles ; elle ne présente pas une hypothèse IA comme un fait
acquis.

### 5.5 Actualisation
Une modification validée des données étudiant ou du calendrier met à jour les données exploitées et
les résultats concernés. Un profil retiré n’est plus proposé dans les nouveaux résultats. Les règles
d’alertes sur modification / republication restent à définir.

## 6. Calendrier de formation et présence possible
### 6.1 Une information détenue par le centre
Le conseiller attaché à l’établissement connaît le planning des cours. Ce planning est enregistré une
seule fois au niveau pertinent : formation ou promotion / groupe, lorsque les rythmes diffèrent. Aucun
compte étudiant ni extraction du planning depuis le CV n’est nécessaire.

### 6.2 Rattachement et héritage
- Le conseiller sélectionne la formation de l’étudiant et, si nécessaire, sa promotion / son groupe.
- Le logiciel associe automatiquement la filière, les informations de formation et le calendrier
correspondant.
- Les étudiants partageant le même calendrier héritent de sa mise à jour ; les jours de cours ne sont
pas recopiés indépendamment dans chaque fiche.
- La date de début de disponibilité et les indisponibilités individuelles connues complètent les
données scolaires.

### 6.3 Données exploitables en V1
Le calendrier est une donnée structurée et non une simple pièce jointe. Pour un rythme hebdomadaire
stable, il précise les jours de cours et la période d’application. Si le rythme varie par semaines ou
périodes, il faut enregistrer ces périodes ou indiquer que la compatibilité nécessite une vérification.

Le choix entre rythme hebdomadaire et périodes datées doit être confirmé avant développement du
contrôle de calendrier. Le calendrier annuel détaillé et la gestion exhaustive des exceptions restent
une évolution possible ; un rythme variable ne doit pas être présenté comme constant.

### 6.4 Calcul et affichage
Sur la période concernée, les jours sans cours représentent des jours potentiellement disponibles
en entreprise, sous réserve de la disponibilité individuelle renseignée. Le logiciel n’en déduit pas une
disponibilité garantie ni un planning contractuel.

Calendrier de cours                        Exigence entreprise     Résultat du contrôle

Cours lundi et mardi                       Présence le vendredi    Pas de conflit scolaire, sous réserve des autres
disponibilités.

Cours lundi et mardi                       Présence le mardi       Conflit scolaire identifié et expliqué.

Calendrier absent ou insuffisant           Présence le vendredi    Compatibilité à vérifier ; aucune confirmation
automatique.

Le contrôle est déterministe. La fiche affiche le rythme, sa période d’application, la date de
disponibilité et les éventuelles réserves. Exemple d’explication : « Profil pertinent, mais cours le
vendredi ».

## 7. Découverte des talents - expérience swipe
### 7.1 Carte courte
Avatar générique non identifiant, prénom uniquement, âge prévu en V2, localisation générale,
formation et pourcentage de compatibilité. L’entreprise peut passer, ouvrir la fiche ou ajouter le profil
à sa sélection. Le parcours reste professionnel et utilisable sur ordinateur.

### 7.2 Profil détaillé
- Prénom, âge prévu en V2 et localisation générale ; formation, calendrier et jours potentiellement
disponibles.
- Score, « Pourquoi ça matche ? », compétences et expériences pertinentes validées.
- Mobilité / permis, disponibilité et informations à vérifier.
- CV validé avec identifiants / coordonnées masqués ; commentaire éventuel du conseiller.
Jamais visibles côté entreprise : nom de famille, téléphone étudiant, e-mail étudiant et adresse
personnelle précise. Ces restrictions s’appliquent aux réponses API, fichiers et liens, pas seulement à
l’écran. La nécessité de l’âge affiché et les règles d’expurgation du CV restent à valider en section 20.

## 8. « À découvrir »
Cette zone propose des talents atypiques ou moins évidents, avec une justification spécifique :
expérience transférable, mobilité adaptée, recommandation du conseiller ou autre élément
documenté. Une qualité telle que l’autonomie ne peut être présentée comme acquise sur la seule
supposition de l’IA.

Cette zone ne constitue pas simplement une liste de scores faibles. La règle autorisant ou interdisant
un profil présentant une contrainte obligatoire non satisfaite reste un arbitrage métier explicite.

## 9. Aucun match utile
- Expliquer les critères bloquants identifiables ou le manque de données.
- Proposer des assouplissements concrets sans les appliquer automatiquement.
- Indiquer, lorsque calculable, combien de talents deviendraient compatibles après modification.
- Afficher des profils « À découvrir » lorsqu’il en existe dans les viviers autorisés.
Si aucun profil n’est disponible, l’écran explique la situation et permet de solliciter le conseiller. Le
logiciel ne fabrique pas de résultat et ne révèle pas l’existence de profils dans des viviers non
autorisés. Chaque nouveau besoin repart de zéro.

## 10. Sélection et mise en relation humaine
- Chaque besoin possède sa propre sélection, sans limite fonctionnelle au nombre de profils retenus.
- L’entreprise déclenche « Demander une mise en relation ».
- La demande apparaît dans l’interface et est envoyée au conseiller responsable.
- Le conseiller dispose du brief validé, des profils choisis et des coordonnées entreprise dans le
respect de ses droits.
- Il appelle l’entreprise, conseille sur la sélection, contacte les étudiants et organise les entretiens.
- Les réserves et refus sur un profil sont expliqués humainement ; aucun e-mail automatique de rejet.
Le routage d’une sélection regroupant plusieurs marques et les états détaillés des demandes restent à
définir. Les changements de disponibilité intervenus entre sélection et prise de contact doivent être
signalés au conseiller.

## 11. Talent Alerts
- Lorsqu’un nouveau profil validé est publié et devient compatible avec un besoin actif, une alerte est
créée immédiatement.
- L’alerte est visible dans l’application et envoyée par e-mail à l’entreprise.
- Elle est rattachée au besoin précis et permet d’ouvrir le profil après authentification.
- Un brouillon ou une proposition IA non validée ne déclenche pas d’alerte.
Les règles de déduplication, les effets des modifications / republications et le délai mesurable
correspondant à « immédiatement » restent à préciser.

## 12. Tableau de bord entreprise
Créer un besoin ; voir les besoins actifs ; ouvrir chaque besoin et sa sélection ; consulter les demandes
; consulter les Talent Alerts ; fermer un besoin lorsque le recrutement n’est plus d’actualité. Les
modalités de fermeture et de réouverture restent à définir.

## 13. Tableau de bord conseiller
Afficher les étudiants / CV disponibles par filière, le total de CV en ligne, les besoins entreprises et les
demandes à traiter. Donner un accès rapide aux fiches, aux brouillons à compléter et aux formations /
calendriers de son périmètre.

L’interface privilégie le vivier, le matching et les mises en relation. Elle ne devient pas un CRM
supplémentaire.

## 14. Fiche étudiant, import et gestion des CV
### 14.1 Référence en base de données
Une entité etudiant porte la fiche structurée et son statut. Les données extraites du CV sont des
propositions tant qu’elles n’ont pas été vérifiées. Les informations corrigées et validées par le
conseiller deviennent la référence de publication et de matching.

Le fichier CV est conservé séparément et référencé en BDD. Les formations, calendriers,
établissements et conseillers sont liés à la fiche. Il n’est pas nécessaire de regrouper toutes les
données dans une seule table physique ; le schéma détaillé sera défini techniquement.

### 14.2 Parcours de publication

Étape                          Action / résultat

**Étape 1. Dépôt**                       Le conseiller dépose le CV et crée / ouvre la fiche dans son périmètre.

**Étape 2. Préremplissage**              Le logiciel extrait les données et les propose dans une fiche brouillon.

**Étape 3. Correction**                  Le conseiller corrige les erreurs, enrichit et renseigne les champs manquants.

**Étape 4. Rattachement**                Il choisit formation / promotion et vérifie le calendrier automatiquement associé.

**Étape 5. Validation**                  Il contrôle les disponibilités et les informations destinées aux entreprises.

**Étape 6. Publication**                 Le profil validé devient accessible aux entreprises autorisées et au matching.

### 14.3 Inconnues et erreurs d’extraction
- « Permis non renseigné » reste distinct de « pas de permis ». Une absence de mention dans le CV
ne prouve pas l’absence d’une compétence.
- Une compétence inférée par l’IA ne devient pas automatiquement une compétence validée.
- En cas d’échec d’extraction, le conseiller peut compléter manuellement ; l’échec ne publie aucun
profil incomplet automatiquement.

### 14.4 Modification et nouveau CV
Le conseiller peut actualiser la fiche. Un nouveau CV propose des modifications à confirmer ; il
n’écrase pas automatiquement les corrections antérieures. Les changements non validés ne doivent
pas être exploités comme des faits confirmés. Les modalités techniques de conservation de la version
publiée sont à préciser.

### 14.5 Étudiant en entretien ou placé
Un étudiant en entretien reste visible. Lorsqu’il a trouvé son contrat, le conseiller le retire
manuellement du vivier. Le retrait désactive la découverte et les nouveaux matchs sans valoir
suppression immédiate des données. Un historique minimal peut être conservé selon les règles à
formaliser.

## 15. Architecture campus / multi-marques

Principe
On partage l’opportunité, pas nécessairement le vivier.

- Chaque école / marque conserve son vivier selon ses droits.
- Un conseiller n’accède pas automatiquement aux étudiants d’une autre marque.
- Les besoins entreprises peuvent être communs au campus selon le paramétrage.
- Le moteur recherche dans plusieurs viviers autorisés sans exposer les données internes d’une
marque aux autres.
- Les demandes concernant un étudiant sont routées vers le conseiller / la marque responsable.

### 15.1 Conséquences du modèle étudiant
La fiche étudiant est rattachée à un établissement / une marque et à un conseiller responsable. La
formation / promotion et son calendrier appartiennent à un périmètre identifié. La consultation, la
modification et la publication respectent ce périmètre.

Le rattachement du conseiller à l’établissement permet la gestion métier des calendriers ; il n’accorde
pas implicitement des droits sur les autres marques. La matrice des droits, les délégations et le
fonctionnement multi-campus restent à formaliser.

## 16. Notifications
Événement                                                     Destinataire / canal

Vérification d’adresse e-mail                                 Entreprise / e-mail lors de l’activation du compte.

Talent Alert                                                  Entreprise / in-app et e-mail, rattachés à un besoin actif.

Nouvelle demande de mise en relation                          Conseiller responsable / in-app et e-mail.

Les liens exigent une authentification. L’autorisation et la disponibilité du profil sont revérifiées à
l’ouverture ; un ancien lien ne réactive pas un profil retiré et ne contourne pas les droits d’accès.

Les notifications destinées aux entreprises ne contiennent pas les coordonnées personnelles des
étudiants. La fréquence, la déduplication et la gestion des échecs d’envoi restent à préciser.

## 17. Règles métier de référence V1
Sujet                                      Règle de référence

Accès / comptes                            Invitation sécurisée uniquement ; un utilisateur par entreprise ; aucun compte
étudiant.

Contact entreprise / étudiant              Contact direct interdit ; mise en relation par le conseiller.

Besoins et sélections                      Plusieurs besoins ; nombre de profils sélectionnés sans limite fonctionnelle.

Données étudiant - V3                      Fiche structurée préremplie depuis le CV, enrichie et validée par le conseiller.

Calendrier - V3                            Hérité de la formation / promotion ; données scolaires complétées par les
disponibilités individuelles.

Contrôle de présence - V3                  Contrôle déterministe ; jours sans cours = disponibilité potentielle, pas
garantie.

Données inconnues - V3                     Absence d’information distincte d’une réponse négative ; aucune validation
implicite par l’IA.

Score                                      Calcul par étudiant / besoin ; seuil de 60 % dans le flux principal ; pondération
à définir.

Nouvelle recherche                         Repart de zéro, sans préférences permanentes issues d’un autre besoin.

Entretien / placement                      En entretien : reste visible. Placé : retrait manuel du vivier.

Nouveau profil compatible                  Talent Alert après publication validée, pour les besoins actifs autorisés.

## 18. Exigences prioritaires de réalisation
Préserver la simplicité du besoin en langage naturel, l’explicabilité du matching, l’autonomie de
découverte de l’entreprise et l’intermédiation humaine. Exploiter le calendrier comme donnée, justifier
« À découvrir » et anticiper le cloisonnement multi-marques.

La V3 ajoute trois exigences : utiliser les données étudiant validées comme référence, partager les
calendriers au niveau formation / promotion, et protéger les champs privés côté API comme dans les
fichiers.

## 19. Périmètre MVP
Invitation et authentification ; formations / calendriers ; fiche étudiant et import CV avec correction ;
brief IA validé ; matching sémantique, contraintes et calendrier ; score et explications ; swipe et fiche
détaillée ; CV expurgé ; « À découvrir » ; absence de match accompagnée ; sélection et mise en
relation ; dashboards ; Talent Alerts ; plusieurs besoins ; fondations multi-marques.

La V3 précise le fonctionnement des fiches et calendriers sans supprimer les fonctionnalités prévues en V2. L’ordre de
livraison et le périmètre du premier pilote restent à arbitrer.

## 20. Points restant à spécifier
Ces points restent ouverts. Les précisions de la V3 sur les fiches étudiants et les calendriers ne
constituent pas une validation implicite des règles ci-dessous.

Sujet                                 Décision / information attendue du client

Données et publication                Champs obligatoires ; référentiel des compétences ; provenance ; règles de
doublons ; fréquence d’actualisation.

Formation / promotion                 Niveau du calendrier ; éventuels groupes ; rattachements multiples ; données
réellement disponibles.

Granularité du calendrier             Rythme hebdomadaire ou périodes datées en V1 ; demi-journées ; exceptions ;
périodes de stage.

Matching                              Pondération ; exclusions ; traitement des inconnues ; seuil ; place des profils
incompatibles dans « À découvrir ».

Administration et droits              Création / édition des formations, calendriers et conseillers ; délégations ; matrice
multi-marques / campus.

Cycles de vie                         États et transitions des besoins et demandes ; modifications après sélection ;
fermeture et réouverture ; profil retiré.

CV et extraction IA                   Formats, tailles et stockage ; contrôle de la version expurgée ; téléchargement ;
erreurs et validation des propositions.

Protection des données                Base légale et information des étudiants ; âge affiché ; droits sans compte ;
conservation, suppression et journalisation ; données transmises au fournisseur IA.

Qualification réglementaire           Analyse du cadre applicable au classement / matching de candidats et
IA                                    responsabilités des acteurs, avec le référent compétent.

Notifications et routage              Sélections multi-marques ; conseiller absent ; republication ; déduplication ; délai
attendu des alertes.

Exploitation et intégrations          Volumes, temps de réponse, hébergement, sécurité, sauvegardes, coût IA ;
intégrations CRM / ERP / ATS futures.

Validation du pilote                  Cas métier de référence ; critères de recette ; taux de découverte, sélection et
mise en relation ; délai de recrutement.

Prochaine étape
Valider avec l’expert métier le dictionnaire des données, la représentation du calendrier et les
règles de compatibilité. Utiliser ensuite des cas représentatifs pour calibrer et recetter le matching.

## Annexe A. Modèle logique minimal proposé
Cette annexe fournit une base de conception, à valider lors du cadrage. Elle ne fige ni les types SQL ni
le découpage physique. La fiche étudiant peut agréger des données provenant de plusieurs tables.

Entité                                   Informations principales / relations

Établissement / marque                   Identité et campus ; périmètre du vivier et des formations.

Conseiller                               Compte, établissement / marque, périmètre autorisé ; responsable des
étudiants.

Formation                                Intitulé, filière et établissement ; rattachement aux promotions et calendriers.

Promotion / groupe                       Niveau optionnel si le calendrier varie pour une même formation.

Calendrier                               Rythme structuré, période d’application ; jours ou périodes de cours selon
l’arbitrage V1.

Étudiant                                 Identité, coordonnées privées, localisation générale, compétences et
expériences validées, mobilité / permis, disponibilité, statut ; liens formation /
promotion et conseiller.

Document CV                              Référence au fichier source et à sa version destinée aux entreprises ;
rattachement à l’étudiant.

Entreprise / besoin                      Compte invité ; besoins distincts avec brief validé, contraintes, dates et viviers
autorisés.

Sélection / demande / alerte             Relations avec besoin et étudiant ; routage vers conseiller ; suivi minimal des
actions.

Règles de données proposées
- La fiche distingue les données privées des données exposables aux entreprises.
- Le permis peut être connu positif, connu négatif ou non renseigné ; appliquer le même principe aux
informations susceptibles d’être inconnues.
- Conserver au minimum la date de dernière validation et le conseiller ayant validé ; le niveau
d’historisation est à préciser.
- La date de disponibilité individuelle ne remplace pas le calendrier scolaire ; les deux sont utilisés
conjointement.
- Les scores appartiennent à la relation étudiant / besoin et sont recalculables.
- Les contenus indexés pour la recherche proviennent des données validées ; ils ne créent pas une
source métier indépendante.

Disponibilité potentielle
Pour une période et des jours demandés : consulter le calendrier associé, relever les conflits de cours,
tenir compte de la date de disponibilité et des indisponibilités connues. Si les données sont
insuffisantes, indiquer « à vérifier ». Le détail de la règle d’éligibilité dépend de l’arbitrage métier de la
section 20.

## Annexe B. Scénarios de recette de la V3
Ces scénarios vérifient les ajouts de la V3. Ils doivent être complétés par la recette des parcours V2 et
par un jeu de besoins / candidats évalué par l’expert métier.

Réf. / situation                                 Résultat attendu

V3-01 / Import CV                                Le dépôt préremplit un brouillon. Aucun profil ni Talent Alert avant
validation et publication.

V3-02 / Correction conseiller                    Une compétence ou coordonnée corrigée est utilisée dans le profil validé
; la valeur initialement extraite ne la remplace pas.

V3-03 / Nouveau CV                               Les nouvelles valeurs sont proposées à confirmation sans écrasement
automatique des corrections précédentes.

V3-04 / Permis inconnu                           Un CV sans mention du permis produit « non renseigné », et non « pas
de permis ».

V3-05 / Calendrier hérité                        Deux étudiants d’une même promotion héritent du calendrier associé ;
une mise à jour est prise en compte pour les deux.

V3-06 / Jour compatible                          Cours lundi / mardi ; besoin vendredi : pas de conflit scolaire. Les autres
contraintes restent contrôlées.

V3-07 / Jour en conflit                          Cours mardi ; présence obligatoire mardi : conflit identifié et expliqué.
L’effet sur l’éligibilité suit la règle métier validée.

V3-08 / Calendrier inconnu                       Aucune confirmation automatique de présence ; le résultat indique une
compatibilité à vérifier.

V3-09 / Disponibilité individuelle               Un jour sans cours n’efface pas une indisponibilité connue ni une date de
début trop tardive.

V3-10 / Retrait du vivier                        Un étudiant placé et retiré disparaît des nouveaux résultats ; un ancien
lien ne donne pas accès à un profil actif.

V3-11 / Confidentialité                          API et documents entreprise ne révèlent ni nom de famille, ni téléphone,
ni e-mail étudiant, ni adresse précise.

V3-12 / Cloisonnement                            Un conseiller ou une entreprise sans autorisation n’accède pas au vivier
d’une autre marque.

Validation métier du matching
Pour chaque besoin de référence, l’expert indique les profils pertinents, les profils impossibles, les
informations à vérifier et les raisons. La recette compare les contrôles, le classement et les
explications à ces décisions. Les objectifs mesurables et les tolérances restent à fixer.

Source : Glimlink - Spécifications fonctionnelles détaillées V2 (document fourni), complétée par les précisions de
cadrage sur la fiche étudiant et le calendrier associé à la formation / promotion.


