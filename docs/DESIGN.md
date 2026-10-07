# Direction de la maquette V1

L'objectif est d'aider une PME à trouver des alternants sans connaître les diplômes. La découverte reste accompagnée par un conseiller.

Palette : forêt #183d36 (actions et navigation), papier #f6f7f2 (fond), citron #e7f19b (découverte), sauge #e6eee8 (confiance), prune #735e86 (talents atypiques), terre #9b512c (réserves).

Typographie : une pile locale Avenir Next / Trebuchet MS / sans-serif, pour fonctionner sans CDN. Titres courts, hiérarchie franche, lignes lisibles. Aucun portrait réel ni âge étudiant.

Le motif visuel distinctif est une constellation de formes : chaque talent a un avatar géométrique non identifiant. La découverte associe cartes, raisons documentées et rythme scolaire directement lisible. Les scores sont des valeurs fictives par besoin, jamais une qualité intrinsèque.

Bureau : navigation latérale, contenu principal, accompagnement contextualisé. Mobile : navigation inférieure, cartes à une colonne, feuilles de détail plein écran. Le swipe dispose toujours des alternatives Passer / Sélectionner et de commandes clavier natives.

Accessibilité : cibles tactiles de 44 px minimum, focus visible, lien d'évitement, dialogs natifs avec gestion du focus, erreurs liées aux champs, annonces des confirmations, respect de prefers-reduced-motion, couleur accompagnée de texte.

Outils : Sites (workflow local), Playwright (contrôles navigateur), frontend-design d'Anthropic (direction visuelle), web-design-guidelines de Vercel (revue ergonomique). Figma a été proposé pour une collaboration facultative, sans connexion confirmée.

Sources des skills consultés :

- https://github.com/anthropics/skills/tree/main/skills/frontend-design
- https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines
- https://github.com/vercel-labs/web-interface-guidelines

Le réseau du terminal ne permet pas le téléchargement externe ; les guides ont été consultés via l'outil web puis récupérés dans `tools/skills/` via les outils du navigateur. Les dépendances proviennent du cache npm existant. Aucune installation globale ni modification des répertoires protégés.


## Calendriers de formation

La vue mensuelle présente les dates réelles du lundi au dimanche et les totaux de jours ouvrés. La vue annuelle affiche les douze mois de l’année civile ; chaque mois ouvre son détail. Sur téléphone, un sélecteur de formation compact précède le calendrier. L’éditeur combine rythme de référence, période d’application, exceptions datées et aperçu immédiat. Une exception peut indiquer des cours, des jours sans cours ou une période à vérifier ; elle ne couvre que les jours ouvrés et remplace le rythme de référence sur sa période. Les chevauchements sont refusés et l’enregistrement conserve les modifications localement.

Les exceptions datées constituent une proposition de maquette pour détailler les rythmes variables. Les jours fériés et vacances ne sont pas déduits automatiquement : ils doivent être renseignés. Les week-ends restent non évalués, les dates hors période restent distinctes et un jour sans cours ne confirme jamais une disponibilité individuelle.


### Couleurs de disponibilité

Le vert vif indique une disponibilité potentielle en entreprise (sans cours), le bleu les cours au centre, l’orange une période à vérifier, le rouge une indisponibilité individuelle, le gris les jours non évalués ou hors période. Ces repères sont identiques dans les vues mois / année, l’éditeur et les rythmes affichés sur les profils. Les libellés restent explicites et la légende précise que les disponibilités doivent être confirmées ; les cours ne sont pas présentés comme une alerte rouge.


### Échelle typographique

La feuille `src/typography.css` centralise la hiérarchie : 16 px pour les textes et champs, 14 px pour les informations secondaires et actions, 12 px pour les badges et dates annuelles, titres de page de 24 à 30 px, titre d’accueil de 28 à 32 px. Les valeurs en rem suivent les préférences du navigateur. Sur téléphone, les cartes de talents donnent plus de place aux informations, les jours du calendrier mensuel associent un numéro lisible à un symbole et la légende précède les dates. Les vues annuelles utilisent les initiales des jours, avec leurs noms complets accessibles. Les couleurs de disponibilité restent identiques.


### Fiche conseiller et données personnelles

La fiche conseiller distingue un bloc de coordonnées réservé au vivier du centre et la fiche professionnelle destinée aux entreprises. Les coordonnées ont leur propre bouton d’enregistrement ; les corrections de la fiche professionnelle nécessitent toujours validation et publication. Le nom complet apparaît dans la recherche et les demandes du conseiller, tandis que l’entreprise conserve le prénom publié. Les demandes ouvrent directement la fiche du candidat ; le contact partenaire affiche le bon interlocuteur selon le rôle. Sur mobile, l’identité et son statut occupent des lignes distinctes et les champs privés s’empilent.


### Éditeur de compétences

L’éditeur remplace les listes séparées par des virgules par une compétence structurée : nom, niveau actuel, état d’acquisition et formation associée. Il reprend les suggestions faciles à ajouter et les niveaux explicites de [Resume.io](https://help.resume.io/en/articles/3784640), ainsi que l’organisation des compétences et de la formation dans le profil [Europass](https://europass.europa.eu/en/create-europass-cv). La proposition est adaptée à la gestion par un conseiller : quatre niveaux décrits (notions, pratique accompagnée, autonome, maîtrise avancée) et une valeur « À évaluer » ; le niveau reste indépendant du statut acquis / en acquisition. Les pourcentages de maîtrise sont évités.

Les acquis apparaissent en vert avec une coche, les acquisitions en cours en bleu avec une horloge. Ces groupes sont visibles dans les cartes, la fiche entreprise et l’aperçu CV, avec le niveau et le lien de formation. Le programme propose des compétences à ajouter explicitement, toujours en acquisition et sans niveau actuel inventé ; son niveau cible est présenté comme un objectif. Le conseiller peut ensuite actualiser le niveau et marquer une compétence acquise, puis valider et publier la fiche. La suppression peut être annulée avant enregistrement. Des raccourcis donnent accès aux coordonnées et aux compétences dans la fiche longue.
