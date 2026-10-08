# Couverture et hypothèses V1

| Spécification          | Maquette                                                                                                                     |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| §2–3 Accès / rôles     | Entreprise et conseiller, invitation et vérification e-mail simulées, aucun compte étudiant                                  |
| §4 Besoin naturel      | Description, exemples, propositions modifiables, contraintes séparées des souhaitables, confirmation explicite               |
| §5 Matching            | Fiches publiées, scores fictifs, raisons documentées et contrôles déterministes                                              |
| §6 Calendrier          | Héritage formation / promotion, période d'application, inconnues, rythme variable et indisponibilités individuelles          |
| §7 Découverte / profil | Grille, carte par carte, swipe avec boutons, avatar générique, prénom et localisation générale, aperçu de CV fictif          |
| §8 À découvrir         | Expérience événementielle transférable, justification distincte d'un score faible                                            |
| §9 Aucun match         | Explication, critères à revoir sans assouplissement automatique, accès aux conflits / inconnues, contact conseiller          |
| §10 Mise en relation   | Sélection par besoin, demande locale, routage conseiller, suivi et contrôles de disponibilité actuels                        |
| §11 / §16 Alertes      | Première publication compatible vers un besoin actif, ouverture conditionnée à la visibilité actuelle                        |
| §12–13 Dashboards      | Besoins, sélection, demandes, alertes côté entreprise ; vivier, brouillons, formations, partenaires côté conseiller          |
| §14 Fiche / CV         | Brouillon manuel ou préremplissage fictif, corrections, nouvelle proposition sans écrasement, publication explicite, retrait |
| §15 Multi-marques      | Périmètre Atelier Campus ; profil test d'un autre périmètre exclu ; autorisations serveur à réaliser                         |

## Hypothèses à arbitrer (§20)

- **Matching** : scores prédéfinis par profil et type de besoin, seuil de 60 %. Conflits séparés et inconnues à vérifier. Une sélection de profil en conflit est possible après explication : l'éligibilité finale reste à arbitrer. Aucun calibrage IA réel.
- **Brief** : préremplissage par mots-clés, dates proposées et modifiables, confirmation obligatoire ; aucun transfert de préférences entre nouveaux besoins.
- **Publication** : prénom, formation et compétence vérifiée exigés, plus confirmation du conseiller. Les champs obligatoires définitifs sont ouverts.
- **Calendrier** : rythme hebdomadaire, période d’application, exceptions datées et vues mois / année. Les dates non renseignées d’un rythme variable restent à vérifier ; un cours connu produit un conflit même si le reste du planning est inconnu. Les demi-journées ne sont pas implémentées. Les jours sans cours restent une présence potentielle et les week-ends ne sont pas évalués.
- **Cycles de vie** : besoin actif / fermé ; demande reçue / prise de contact / entretien à organiser. États illustratifs ; fermeture arrête découverte et nouvelles alertes, sans réouverture automatique.
- **Alertes** : première publication, déduplication profil / besoin, aucune alerte sur sauvegarde d'un brouillon. Effets de republication et d'actualisation à préciser.
- **Routage** : plusieurs comptes entreprise fictifs avec besoins et demandes séparés ; une conseillère Mathilde JEANNE et un vivier pour les parcours principaux. Pas de gestion des sélections multi-marques.
- **CV** : aucun vrai fichier lu, extrait ou stocké. Aperçu généré depuis la fiche publiée ; il ne démontre pas l'expurgation d'un PDF réel.
- **Protection** : sélecteur de rôle destiné à la revue, sans authentification réelle. Données locales, sans coordonnées étudiantes réelles. Les droits devront être appliqués côté serveur.

## Annexe B

Les tests métier portent les identifiants V3-01 à V3-12. V3-11 vérifie que la projection entreprise exclut les coordonnées privées, les brouillons et les champs supplémentaires non autorisés ; V3-12 vérifie le filtre local de visibilité. Ces tests ne remplacent pas les futurs contrôles de sécurité API, stockage et fichiers.

« Simuler un nouveau CV » illustre V3-03 : la proposition entre dans le brouillon après acceptation, tandis que la version publiée reste conservée jusqu'à une nouvelle validation.

## Données personnelles et périmètres

Le conseiller Atelier Campus voit le prénom et le nom des candidats de son vivier et peut enregistrer leur nom de famille, e-mail, téléphone, adresse, code postal et ville de résidence. Ces coordonnées sont distinctes de la fiche professionnelle publiée. Une correction privée ne publie pas les modifications professionnelles non validées. Les valeurs de démonstration sont fictives ; les anciennes sauvegardes locales sont complétées sans réinitialisation.

La projection entreprise contient uniquement les champs de la version publiée, sans coordonnées, sans propositions et sans corrections du brouillon. Les profils retirés peuvent rester identifiables dans l’historique d’une sélection, mais ne sont plus proposés dans la découverte ni dans une nouvelle demande. Les fiches conseiller et les modifications privées sont limitées à son établissement ; les demandes permettent d’ouvrir la fiche complète d’un candidat de ce périmètre. Le conseiller contacte le partenaire entreprise ; l’entreprise contacte Mathilde JEANNE. Le guide présente les parcours correspondant au rôle actif.

La maquette autonome contient les deux jeux de vues et les données fictives dans le même navigateur : la projection illustre le contrat attendu des futures réponses API. Elle ne remplace pas une authentification et une autorisation serveur. Les champs de texte libre destinés à l’entreprise doivent toujours être contrôlés avant publication ; aucun traitement de PDF réel n’est simulé comme acquis.

## Compétences acquises et acquisitions en cours

L’extension demandée ajoute un niveau actuel et un état d’acquisition à chaque compétence, ainsi qu’un lien facultatif vers une formation. Les objectifs de formation sont des exemples fictifs de programme : ils ne représentent pas un référentiel RNCP validé. Ajouter une proposition de programme ne transforme pas un objectif pédagogique en acquis : le conseiller doit confirmer que l’acquisition a commencé, puis renseigner le niveau connu. Le statut et le niveau restent indépendants ; une formation terminée ne valide aucune compétence automatiquement.

Les quatre niveaux et leurs descriptions sont une proposition de maquette à valider avec l’expert métier. Les anciennes compétences textuelles sont migrées avec leur libellé, leur statut acquis hérité de la fiche vérifiée, un niveau « À évaluer » et sans lien formation inventé. Les exemples initiaux affichent des niveaux fictifs et une acquisition en cours pour rendre la lecture visible. La publication conserve statut, niveau et lien ; la sauvegarde du brouillon ne change pas la version entreprise. Les scores restent illustratifs et ne constituent pas un moteur évaluant les niveaux ou confondant les acquisitions avec les acquis.

## Corrections issues de l’audit fonctionnel

Les briefs confirmés utilisent un composant commun et montrent missions, compétences, domaines, souhaitables, mobilité, dates et obligations. La description initiale reste consultable comme source. La mobilité candidat est renseignable et reste « à vérifier » si absente ; aucun score réel n’en est déduit.

Les périmètres du conseiller sont appliqués aux listes et compteurs. Les comptes entreprise disposent de viviers autorisés indépendants des besoins ; leurs besoins, demandes et alertes sont séparés. Le sélecteur d’entreprise est un outil de démonstration disponible sur mobile et ordinateur. Les invitations et activations alimentent la liste des partenaires et persistent localement, sans envoi ni authentification réelle.

Un profil publié peut avoir des corrections en attente : badge, filtre, compteur et comparaison les rendent visibles sans remplacer sa version publique. Le validateur est conservé lors des nouvelles publications. Les anciennes validations sans identité connue restent signalées comme telles.

La fiche entreprise présente les vues mois/année, les exceptions datées, la date de disponibilité et les indisponibilités individuelles. Les jours sans cours restent potentiels. Le rythme hebdomadaire est une vue secondaire explicitement de référence.

L’aide sans résultat explique les contraintes et compte les gains d’assouplissements calculables sur les profils autorisés. Choisir une proposition ouvre le brief en attente de confirmation ; la recherche ne reprend qu’après validation. Ces estimations utilisent les scores fictifs et ne constituent pas un matching sémantique.

Les nouvelles demandes conservent leur contexte initial. Le conseiller voit les modifications de brief, disponibilité, permis, mobilité, retrait ou calendrier intervenues depuis la demande ; les anciennes demandes sans référence invitent à une revérification. Date d’entretien envisagée et compte rendu local complètent l’intermédiation humaine. Le compte rendu est exclu de la projection entreprise. Les états restent illustratifs en attente de l’arbitrage §20.

## Découverte par cartes

L’entreprise découvre les candidats en mode Cartes par défaut : geste à droite pour sélectionner, à gauche pour passer. L’action conserve les listes propres au besoin et peut être annulée dans la session. Les choix persistent localement ; la grille permet de revoir les profils, et les profils passés peuvent être réaffichés. Les cartes utilisent les avatars génériques, le prénom et les données professionnelles publiées. Les informations inconnues et les conflits restent visibles ; une sélection ne déclenche pas une mise en relation automatique. Les gestes ont des alternatives par boutons et clavier, et respectent la préférence de réduction des animations.

## Évolution demandée par l’utilisateur — 8 octobre 2026

Cette demande actualise le parcours entreprise de la maquette : l’accueil conserve le message de bienvenue, une recherche en langage naturel, trois boutons chiffrés (besoins actifs, mises en relation effectuées, nouveaux profils compatibles) et la conseillère référente. Les profils, cartes de swipe et suggestions sont retirés de l’accueil. La recherche simple initie un nouveau besoin ; les modifications de besoins existants se font dans la rubrique Besoins.

Les besoins affichent leur avancement et leurs Talent Alerts propres. Leur ouverture conduit aux cartes de profils, avec les pourcentages illustratifs existants, sans modifier le moteur de critères. La rubrique Ma sélection utilise un résumé avatar/prénom/formation par besoin, ouvre la fiche publiée et permet de demander une mise en relation. Ses suggestions proviennent des profils déjà disponibles et excluent les profils retenus, passés et ceux associés aux Talent Alerts du besoin.

Un nouveau statut « Mise en relation effectuée », confirmé par le conseiller, clôture automatiquement le besoin. Une simple demande ou une prise de contact le laisse actif. Le compteur de l’accueil porte sur les demandes ainsi confirmées, et non sur toutes les demandes reçues. Les besoins clôturés conservent leur brief et leur historique de demandes. Le compteur global Talent Alerts porte sur les profils compatibles non lus distincts pour les besoins actifs ; chaque besoin affiche son propre nombre.

L’invitation associe l’entreprise à Mathilde JEANNE, conseillère référente de la démonstration. La création du profil et la vérification simulée de l’e-mail produisent une notification d’inscription pour elle, avec un accès au contact téléphonique. La notification est conservée, lisible et non dupliquée après activation. Ce parcours demeure local : aucun lien sécurisé réel ni e-mail n’est envoyé par la maquette.
