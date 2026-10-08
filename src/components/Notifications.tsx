import { useApp } from '../context.tsx';
import {
  canSimulateNotification,
  notifications,
  readNotifications,
  simulateNotification,
} from '../domain/notifications.ts';
import { Badge, Button, Empty, Icon, Modal, dateLabel } from './ui.tsx';
export default function Notifications() {
  const { store, role, setStore, closeModal, openModal, go, notify } = useApp();
  const items = notifications(store, role);
  const unread = items.filter((item) => !item.read);
  const canSimulate = canSimulateNotification(store, role);
  const read = (ids: string[]) => setStore((prev) => readNotifications(prev, role, ids));
  return (
    <Modal title="Notifications" onClose={closeModal}>
      <p>
        {role === 'company'
          ? 'Les talents validés à découvrir pour vos besoins.'
          : 'Les demandes des entreprises de votre vivier.'}
      </p>
      <div className="notification-tools">
        <Badge tone={unread.length ? 'green' : 'neutral'}>
          {unread.length} non lue{unread.length > 1 ? 's' : ''}
        </Badge>
        <Button
          variant="secondary"
          disabled={!unread.length}
          onClick={() => read(unread.map((item) => item.id))}
        >
          <Icon name="check" />
          Tout marquer comme lu
        </Button>
      </div>
      <div className="notification-list">
        {items.map((item) => (
          <article key={item.id} className={`notification-item ${item.read ? '' : 'unread'}`}>
            <div className="notification-heading">
              <strong>{item.title}</strong>
              {!item.read && <Badge tone="green">Nouveau</Badge>}
              {item.simulated && <Badge>Simulation</Badge>}
            </div>
            <p>{item.message}</p>
            {item.date && <small>{dateLabel(item.date)}</small>}
            <div className="notification-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  read([item.id]);
                  if (item.welcome) return;
                  closeModal();
                  if (role === 'company' && item.studentId)
                    openModal({ kind: 'profile', studentId: item.studentId, needId: item.needId! });
                  else
                    go(role === 'company' ? 'alerts' : item.companyId ? 'companies' : 'requests');
                }}
              >
                {item.welcome
                  ? 'Compris'
                  : role === 'company'
                    ? item.studentId
                      ? 'Voir le profil'
                      : 'Voir les alertes'
                    : item.companyId
                      ? 'Contacter l’entreprise'
                      : 'Voir les demandes'}
                <Icon name="arrow" size={16} />
              </Button>
              {!item.read && (
                <button className="text-button" onClick={() => read([item.id])}>
                  Marquer comme lu
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
      {!items.length && (
        <Empty title="Aucune notification pour le moment">
          Les nouveaux événements apparaîtront ici.
        </Empty>
      )}
      <section className="notification-simulation">
        <h3>Tester la cloche</h3>
        <p>Ajoutez un événement fictif à la démonstration.</p>
        <Button
          disabled={!canSimulate}
          onClick={() => {
            setStore((prev) => simulateNotification(prev, role));
            notify(
              role === 'company'
                ? 'Notification de talent simulée.'
                : 'Demande de mise en relation simulée.',
            );
          }}
        >
          <Icon name="bell" />
          {role === 'company' ? 'Simuler une alerte de talent' : 'Simuler une demande entreprise'}
        </Button>
        {!canSimulate && (
          <p className="micro">
            Aucun autre profil éligible pour vos besoins actifs. Consultez les notifications
            existantes ou vérifiez vos besoins.
          </p>
        )}
        <p className="micro">Simulation locale : aucun e-mail n’est envoyé.</p>
      </section>
    </Modal>
  );
}
