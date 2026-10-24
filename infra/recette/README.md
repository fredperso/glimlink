# Serveur de recette

Serveur `glimlink-recette-01` (OVHcloud Public Cloud, Paris 3-AZ, b3-8, Debian 13), adresse `recette.app.glimlink.com`. Voir DCK-004, DCK-005 et DCK-009 dans [l’architecture technique](../../specificaiton/spec-architecture-technique.md).

## Durcissement

`durcissement.sh` met le système à jour, active les mises à jour de sécurité automatiques, limite SSH aux clés et à l’utilisateur `debian`, n’ouvre que 80/443 au public et SSH aux adresses d’administration, durcit le noyau, puis installe Docker depuis le dépôt officiel (clé vérifiée).

1. Relever son adresse IP publique, par exemple avec `curl -4 https://ifconfig.me`. Une adresse qui change (box Internet) peut couper l’accès SSH : prévoir alors une plage plus large ou la console KVM d’OVHcloud.
2. Copier puis lancer le script depuis la racine du dépôt :

   ```sh
   scp infra/recette/durcissement.sh debian@recette.app.glimlink.com:
   ssh debian@recette.app.glimlink.com
   sudo ADMIN_CIDRS="<votre-ip>/32" bash durcissement.sh
   ```

3. Sans fermer la session, ouvrir une seconde session SSH pour vérifier l’accès.

En cas de blocage : console KVM de l’instance dans l’espace client OVHcloud, ou mode rescue.

## Limites

- Les ports publiés par Docker contournent le pare-feu de l’hôte : seul le service `proxy` publie des ports (DCK-004).
- Le compte `deploy` et sa clé à commande forcée (DCK-008) seront ajoutés avec le premier déploiement ; il faudra alors l’ajouter à `AllowUsers`.
- Un groupe de sécurité OVHcloud équivalent reste à définir dans OpenTofu (DCK-010).
