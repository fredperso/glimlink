import { useApp } from '../context.tsx';
import { requestAdviserHelp, type Need } from '../domain/model.ts';
import { Button, Icon, dateLabel } from './ui.tsx';

// Relais humain (V6 §11) : sans profil retenu, Glimlink propose le conseiller plutôt que de
// conclure à l’absence de candidats. Le seuil de déclenchement automatique reste à arbitrer.
export default function AdviserRelay({ need }: { need: Need }) {
  const { setStore, notify } = useApp();
  return (
    <section className="adviser-relay" aria-labelledby={`relay-${need.id}`}>
      <span className="adviser-avatar" aria-hidden="true">
        MJ
      </span>
      <div>
        <h3 id={`relay-${need.id}`}>Vous n’avez pas encore trouvé le profil recherché ?</h3>
        <p>Votre conseiller peut affiner votre besoin avec vous et vous proposer d’autres pistes.</p>
        {need.helpRequestedAt ? (
          <p className="relay-sent">
            <Icon name="check" size={16} /> Mathilde a été prévenue le{' '}
            {dateLabel(need.helpRequestedAt)}. Elle reprend ce besoin avec vous.
          </p>
        ) : (
          <Button
            onClick={() => {
              setStore((prev) => requestAdviserHelp(prev, need.id));
              notify('Mathilde est prévenue. Elle vous recontacte pour affiner votre besoin.');
            }}
          >
            <Icon name="message" size={17} /> Être accompagné par Mathilde
          </Button>
        )}
      </div>
    </section>
  );
}
