import type { Need } from '../domain/model.ts';
import { dateLabel } from './ui.tsx';

export default function ValidatedBrief({ need }: { need: Need }) {
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
            {need.contract} · {need.location}
          </dd>
        </div>
        <div>
          <dt>Période</dt>
          <dd>
            {dateLabel(need.start)} – {dateLabel(need.end)}
          </dd>
        </div>
        <div>
          <dt>Présence obligatoire</dt>
          <dd>{need.requiredDays.join(', ') || 'Aucun jour imposé'}</dd>
        </div>
        <div>
          <dt>Permis B</dt>
          <dd>{need.licenseRequired ? 'Obligatoire' : 'Non obligatoire'}</dd>
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
