import { useState, type FormEvent } from 'react';
import { useApp } from '../context.tsx';
import {
  EMPTY_PERSONAL_DETAILS,
  savePersonalDetails,
  type Student,
  type StudentPersonalDetails,
} from '../domain/model.ts';
import { Badge, Button, Icon } from './ui.tsx';

export default function PersonalDetailsEditor({ student }: { student: Student }) {
  const { role, setStore, notify } = useApp();
  const [details, setDetails] = useState<StudentPersonalDetails>(() => ({
    ...EMPTY_PERSONAL_DETAILS,
    ...student.personalDetails,
  }));
  const [saved, setSaved] = useState(false);
  if (role !== 'adviser' || student.school !== 'campus-a') return null;
  const patch = (field: keyof StudentPersonalDetails, value: string) => {
    setDetails({ ...details, [field]: value });
    setSaved(false);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    setStore((previous) =>
      savePersonalDetails(previous, student.id, details, { role, school: 'campus-a' }),
    );
    setSaved(true);
    notify('Données personnelles enregistrées. Elles restent réservées aux conseillers habilités.');
  };
  return (
    <section className="personal-details-editor" aria-labelledby="personal-details-title">
      <div className="section-heading">
        <h3 id="personal-details-title">
          <Icon name="shield" />
          Données personnelles du candidat
        </h3>
        <Badge>Accès conseiller</Badge>
      </div>
      <p>
        Vous pouvez consulter et modifier les coordonnées de ce candidat de votre vivier. Elles ne
        sont jamais publiées aux entreprises.
      </p>
      <p className="micro">
        Coordonnées de démonstration fictives. Laissez un champ vide lorsque l’information est
        inconnue.
      </p>
      <form onSubmit={submit}>
        <div className="form-grid">
          <label>
            Nom de famille
            <input
              name="lastName"
              autoComplete="off"
              maxLength={100}
              value={details.lastName}
              onChange={(event) => patch('lastName', event.target.value)}
            />
          </label>
          <label>
            E-mail du candidat
            <input
              name="studentEmail"
              type="email"
              autoComplete="off"
              maxLength={160}
              value={details.email}
              onChange={(event) => patch('email', event.target.value)}
            />
          </label>
          <label>
            Téléphone du candidat
            <input
              name="studentPhone"
              type="tel"
              autoComplete="off"
              maxLength={40}
              value={details.phone}
              onChange={(event) => patch('phone', event.target.value)}
            />
          </label>
          <label>
            Adresse personnelle
            <input
              name="studentAddress"
              autoComplete="off"
              maxLength={200}
              value={details.address}
              onChange={(event) => patch('address', event.target.value)}
            />
          </label>
          <label>
            Code postal
            <input
              name="postalCode"
              autoComplete="off"
              maxLength={20}
              value={details.postalCode}
              onChange={(event) => patch('postalCode', event.target.value)}
            />
          </label>
          <label>
            Ville de résidence
            <input
              name="studentCity"
              autoComplete="off"
              maxLength={100}
              value={details.city}
              onChange={(event) => patch('city', event.target.value)}
            />
          </label>
        </div>
        <div className="personal-details-actions">
          <Button type="submit" variant="secondary">
            <Icon name="check" />
            Enregistrer les données personnelles
          </Button>
          {saved && <span role="status">Coordonnées enregistrées</span>}
        </div>
      </form>
    </section>
  );
}
