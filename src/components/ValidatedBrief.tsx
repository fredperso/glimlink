import { useApp } from '../context.tsx';
import type { Need } from '../domain/model.ts';
import { dateLabel } from './ui.tsx';

export const contractLabel = (contract: string) =>
  contract === 'Alternance' ? 'Alternance / CPRO' : contract;

export default function ValidatedBrief({ need }: { need: Need }) {
  const { store } = useApp();
  const training = store.calendars.find((calendar) => calendar.id === need.suggestedTrainingId);
  return (
    <div className="validated-brief">
      <h3>Missions confirmées</h3>
      <ul>
        {need.missions
          .filter((mission) => mission.trim())
          .map((mission, index) => (
            <li key={index}>{mission}</li>
          ))}
      </ul>
      <dl className="brief-facts">
        <div>
          <dt>Contrat et lieu</dt>
          <dd>
            {contractLabel(need.contract)} · {need.location}
          </dd>
        </div>
        <div>
          <dt>Disponibilité</dt>
          <dd>
            {need.availability === 'next-intake' ? 'Prochaine rentrée' : 'Besoin immédiat'} ·{' '}
            {dateLabel(need.start)} – {dateLabel(need.end)}
          </dd>
        </div>
        <div>
          <dt>Niveaux acceptés</dt>
          <dd>{need.levels?.join(', ') || 'Tous niveaux'}</dd>
        </div>
        <div>
          <dt>Formation suggérée</dt>
          <dd>{training?.title.split(' · ')[0] ?? 'Aucune préférence'}</dd>
        </div>
        <div>
          <dt>Présence obligatoire</dt>
          <dd>
            {need.requiredDays.join(', ') || 'Aucune : le calendrier n’est pas utilisé'}
          </dd>
        </div>
        <div>
          <dt>Prérequis</dt>
          <dd>
            {[
              need.licenseRequired ? 'Permis B obligatoire' : '',
              need.language ? `${need.language} ${need.languageLevel ?? ''}`.trim() : '',
            ]
              .filter(Boolean)
              .join(' · ') || 'Aucun'}
          </dd>
        </div>
        <div>
          <dt>Mobilité demandée</dt>
          <dd>{need.mobility || 'À préciser'}</dd>
        </div>
        <div>
          <dt>Compétences confirmées</dt>
          <dd>{need.proposedSkills?.join(', ') || 'Non précisées'}</dd>
        </div>
        <div>
          <dt>Domaines envisagés</dt>
          <dd>{need.proposedDomains?.join(', ') || 'Recherche transversale'}</dd>
        </div>
        <div>
          <dt>Critères souhaitables</dt>
          <dd>{need.wishes || 'Aucun renseigné'}</dd>
        </div>
      </dl>
      <details>
        <summary>Description initiale de l’entreprise</summary>
        <p>{need.description}</p>
      </details>
    </div>
  );
}
