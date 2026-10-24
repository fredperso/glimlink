#!/usr/bin/env bash
# Durcissement du serveur de recette glimlink-recette-01 (Debian 13, OVHcloud Public Cloud).
# Exigences : DCK-004 (ports exposés), DCK-005 (Docker), DCK-009 (hôte) de
# specificaiton/spec-architecture-technique.md.
#
# Usage, depuis une session SSH ouverte sur le serveur :
#   sudo ADMIN_CIDRS="203.0.113.10/32" bash durcissement.sh
# ADMIN_CIDRS : adresses autorisées en SSH, séparées par des espaces (IPv4 et/ou IPv6).
# Le script est idempotent : il peut être relancé après une modification.
set -euo pipefail

ADMIN_USER="${ADMIN_USER:-debian}"
ADMIN_CIDRS="${ADMIN_CIDRS:-}"
SSH_PORT="${SSH_PORT:-22}"
REBOOT_TIME="${REBOOT_TIME:-04:00}"
# Empreinte publiée de la clé de signature des paquets Docker.
DOCKER_GPG_FINGERPRINT="9DC858229FC7DD38854AE2D88D81803C0EBFCD88"

log() { printf '\n==> %s\n' "$*"; }
fail() { printf 'Erreur : %s\n' "$*" >&2; exit 1; }

[[ $EUID -eq 0 ]] || fail "lancer le script avec sudo."
[[ -n "$ADMIN_CIDRS" ]] || fail "ADMIN_CIDRS est obligatoire, sinon le pare-feu couperait l'accès SSH."
. /etc/os-release
[[ "$ID" == "debian" ]] || fail "système non pris en charge : $ID."
id "$ADMIN_USER" >/dev/null 2>&1 || fail "utilisateur $ADMIN_USER introuvable."
[[ -s "/home/$ADMIN_USER/.ssh/authorized_keys" ]] || fail "aucune clé SSH pour $ADMIN_USER : la désactivation des mots de passe couperait l'accès."

ipv4_cidrs=()
ipv6_cidrs=()
for cidr in $ADMIN_CIDRS; do
  if [[ "$cidr" == *:* ]]; then ipv6_cidrs+=("$cidr"); else ipv4_cidrs+=("$cidr"); fi
done
join() { local IFS=','; echo "$*"; }

export DEBIAN_FRONTEND=noninteractive

log "Mise à jour du système"
apt-get update -q
apt-get -y -q full-upgrade
apt-get -y -q install --no-install-recommends \
  ca-certificates curl gnupg nftables unattended-upgrades apt-listchanges \
  apparmor apparmor-utils systemd-timesyncd

log "Fuseau horaire UTC et synchronisation de l'heure"
timedatectl set-timezone UTC
systemctl enable --now systemd-timesyncd

log "Mises à jour de sécurité automatiques (redémarrage à $REBOOT_TIME UTC si nécessaire)"
cat >/etc/apt/apt.conf.d/20auto-upgrades <<'EOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
APT::Periodic::AutocleanInterval "7";
EOF
cat >/etc/apt/apt.conf.d/52glimlink-unattended-upgrades <<EOF
Unattended-Upgrade::Origins-Pattern {
  "origin=Debian,codename=\${distro_codename}-security,label=Debian-Security";
  "origin=Debian,codename=\${distro_codename},label=Debian";
  "origin=Docker,label=Docker CE";
};
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "$REBOOT_TIME";
EOF
systemctl enable --now unattended-upgrades

log "Configuration SSH : clé uniquement, root interdit"
cat >/etc/ssh/sshd_config.d/10-glimlink.conf <<EOF
Port $SSH_PORT
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AuthenticationMethods publickey
AllowUsers $ADMIN_USER
MaxAuthTries 3
LoginGraceTime 30
ClientAliveInterval 300
ClientAliveCountMax 2
X11Forwarding no
AllowAgentForwarding no
AllowTcpForwarding no
PermitTunnel no
EOF
sshd -t || fail "configuration SSH invalide, rien n'a été rechargé."
systemctl reload ssh

log "Paramètres noyau"
# ip_forward reste actif : Docker en a besoin pour ses réseaux.
cat >/etc/sysctl.d/90-glimlink.conf <<'EOF'
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.send_redirects = 0
net.ipv4.conf.all.accept_source_route = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv6.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_source_route = 0
net.ipv4.conf.all.log_martians = 1
net.ipv4.tcp_syncookies = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
kernel.kptr_restrict = 2
kernel.dmesg_restrict = 1
kernel.unprivileged_bpf_disabled = 1
kernel.yama.ptrace_scope = 1
fs.protected_hardlinks = 1
fs.protected_symlinks = 1
fs.protected_fifos = 2
fs.protected_regular = 2
fs.suid_dumpable = 0
EOF
sysctl --system >/dev/null

log "Pare-feu de l'hôte (nftables)"
# Table dédiée, sans « flush ruleset » : les règles créées par Docker sont conservées.
ssh_rules=""
[[ ${#ipv4_cidrs[@]} -gt 0 ]] && ssh_rules+="    ip saddr { $(join "${ipv4_cidrs[@]}") } tcp dport $SSH_PORT accept"$'\n'
[[ ${#ipv6_cidrs[@]} -gt 0 ]] && ssh_rules+="    ip6 saddr { $(join "${ipv6_cidrs[@]}") } tcp dport $SSH_PORT accept"$'\n'
install -m 0755 -d /etc/nftables.d
cat >/etc/nftables.d/glimlink.nft <<EOF
table inet glimlink_host
delete table inet glimlink_host
table inet glimlink_host {
  chain input {
    type filter hook input priority filter; policy drop;
    iif "lo" accept
    ct state established,related accept
    ct state invalid drop
    ip protocol icmp icmp type { echo-request, destination-unreachable, time-exceeded } limit rate 10/second accept
    ip6 nexthdr icmpv6 accept
$ssh_rules    tcp dport { 80, 443 } accept
    counter drop
  }
}
EOF
nft -c -f /etc/nftables.d/glimlink.nft || fail "règles nftables invalides."
cat >/etc/nftables.conf <<'EOF'
#!/usr/sbin/nft -f
include "/etc/nftables.d/glimlink.nft"
EOF
systemctl enable nftables
systemctl restart nftables

log "Résolution DNS locale sans LLMNR ni mDNS"
install -m 0755 -d /etc/systemd/resolved.conf.d
cat >/etc/systemd/resolved.conf.d/10-glimlink.conf <<'EOF'
[Resolve]
LLMNR=no
MulticastDNS=no
EOF
systemctl restart systemd-resolved

log "Installation de Docker (dépôt officiel, clé vérifiée)"
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg -o /tmp/docker.asc
actual_fingerprint="$(gpg --show-keys --with-colons /tmp/docker.asc | awk -F: '/^fpr:/ {print $10; exit}')"
[[ "$actual_fingerprint" == "$DOCKER_GPG_FINGERPRINT" ]] || fail "empreinte de la clé Docker inattendue : $actual_fingerprint."
install -m 0644 /tmp/docker.asc /etc/apt/keyrings/docker.asc
rm -f /tmp/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian $VERSION_CODENAME stable" \
  >/etc/apt/sources.list.d/docker.list
apt-get update -q
apt-get -y -q install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

log "Configuration du démon Docker"
install -m 0755 -d /etc/docker
cat >/etc/docker/daemon.json <<'EOF'
{
  "log-driver": "json-file",
  "log-opts": { "max-size": "10m", "max-file": "5" },
  "live-restore": true,
  "no-new-privileges": true,
  "userland-proxy": false,
  "icc": false
}
EOF
systemctl enable docker
systemctl restart docker

log "Répertoires de l'application"
install -m 0755 -d /opt/glimlink
install -m 0700 -d /etc/glimlink /etc/glimlink/secrets

log "Contrôles finaux"
echo "Ports en écoute :"
ss -tulpn
echo
nft list table inet glimlink_host
echo
docker version --format 'Docker {{.Server.Version}}'
docker compose version
echo
echo "Durcissement terminé. Avant de fermer cette session, ouvrir une seconde session SSH pour vérifier l'accès."
