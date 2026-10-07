import { useId, useState } from 'react';

export const LOCATION_CHOICES = [
  'Montpellier',
  'Lattes',
  'Castelnau-le-Lez',
  'Pérols',
  'Saint-Jean-de-Védas',
  'Mauguio',
  'Nîmes',
  'Sète',
  'Béziers',
];

export const CANDIDATE_MOBILITY = [
  'À vérifier',
  'Jusqu’à 15 km du domicile',
  'Jusqu’à 30 km du domicile',
  'Jusqu’à 50 km du domicile',
  'Toute la région',
  'France entière',
];
export const REQUIRED_MOBILITY = [
  'À préciser',
  'Sur un site fixe',
  'Déplacements locaux',
  'Déplacements régionaux',
  'Déplacements nationaux',
];
export const SKILL_CHOICES = [
  'Accueil',
  'Relation client',
  'Vente',
  'Prospection',
  'Communication digitale',
  'Rédaction',
  'Réseaux sociaux',
  'Excel',
  'Gestion administrative',
  'Comptabilité',
  'Organisation',
  'Gestion de projet',
  'Logistique',
  'Travail en équipe',
];
export const DOMAIN_CHOICES = [
  'Commerce',
  'Communication',
  'Gestion administrative',
  'Comptabilité',
  'Informatique',
  'Logistique',
  'Services',
  'Industrie',
  'Santé et social',
  'Hôtellerie et restauration',
];
export const SECTOR_CHOICES = [
  'Services aux entreprises',
  'Architecture & aménagement',
  'Communication & création',
  'Commerce & distribution',
  'Conseil & gestion administrative',
  'Transport & logistique',
  'Informatique',
  'Industrie',
  'Santé et social',
  'Hôtellerie et restauration',
];
export const POSITION_CHOICES = [
  'Direction',
  'Responsable des ressources humaines',
  'Chargé de recrutement',
  'Responsable d’équipe',
  'Tuteur / maître d’apprentissage',
];

// Une ancienne valeur reste sélectionnable : aucune donnée enregistrée n’est effacée.
export function ChoiceSelect({
  options,
  value,
  onChange,
  name,
  required = false,
  allowCustom = false,
  placeholder = 'Choisir…',
}: {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  name: string;
  required?: boolean;
  allowCustom?: boolean;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value ?? '');
  const [custom, setCustom] = useState(false);
  const selected = value ?? local;
  const choices = [...new Set([...options, ...(selected ? [selected] : [])])];
  const change = (next: string) => {
    setLocal(next);
    onChange?.(next);
  };
  return (
    <span className="choice-control">
      <select
        name={custom ? undefined : name}
        value={custom ? '__custom__' : selected}
        required={required}
        onChange={(event) => {
          if (event.target.value === '__custom__') {
            setCustom(true);
            change('');
          } else {
            setCustom(false);
            change(event.target.value);
          }
        }}
      >
        <option value="">{placeholder}</option>
        {choices.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
        {allowCustom && <option value="__custom__">Autre…</option>}
      </select>
      {custom && (
        <input
          aria-label="Préciser un autre choix"
          name={name}
          required={required}
          value={selected}
          maxLength={120}
          onChange={(event) => change(event.target.value)}
          placeholder="Préciser…"
        />
      )}
    </span>
  );
}

export function MultiChoice({
  label,
  options,
  values,
  onChange,
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  const id = useId();
  const [extra, setExtra] = useState('');
  const choices = [...new Set([...options, ...values])];
  return (
    <fieldset className="choice-group">
      <legend>{label}</legend>
      <p className="micro">{values.length ? values.join(', ') : 'Aucun choix sélectionné'}</p>
      <details className="choice-options">
        <summary>Choisir / modifier ({values.length})</summary>
        <div className="choice-list">
          {choices.map((option) => (
            <label key={option}>
              <input
                type="checkbox"
                checked={values.includes(option)}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...values, option]
                      : values.filter((value) => value !== option),
                  )
                }
              />
              {option}
            </label>
          ))}
        </div>
        <details>
          <summary>Ajouter un autre choix</summary>
          <label htmlFor={id}>
            Autre {label.toLocaleLowerCase()}
            <input
              id={id}
              value={extra}
              maxLength={100}
              onChange={(event) => setExtra(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="text-button"
            disabled={!extra.trim()}
            onClick={() => {
              const next = extra.trim();
              if (next && !values.includes(next)) onChange([...values, next]);
              setExtra('');
            }}
          >
            Ajouter ce choix
          </button>
        </details>
      </details>
    </fieldset>
  );
}
