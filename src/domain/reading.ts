import { briefMissions } from './brief.ts';
import type { Calendar, Need, Student } from './model.ts';

// Lecture personnalisée simulée (V6 §8-9). Elle distingue ce que la fiche validée prouve,
// ce qui reste en acquisition et le lien avec chaque mission ; elle n’invente rien.

export type MissionLink = {
  mission: string;
  status: 'experience' | 'acquired' | 'learning' | 'unknown';
  label: string;
};
export type Reading = {
  why: string;
  highlights: string[];
  proven: string[];
  transferable: string[];
  missions: MissionLink[];
  declic?: string;
};

const STOP = new Set(
  'les des une pour avec dans sur aux leur leurs nos vos son ses mes cette ces tout tous toute faire mettre jour assurer contribuer accompagner aider participer effectuer gestion suivre suivi preparer gerer'.split(
    ' ',
  ),
);
// Racines comparables : « accueillir » et « accueil », « clients » et « client ».
const stems = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase('fr')
    .split(/[^a-z]+/)
    .filter((word) => word.length >= 4 && !STOP.has(word))
    .map((word) => word.slice(0, 6));
const overlaps = (a: string, b: string) => {
  const right = new Set(stems(b));
  return stems(a).some((stem) => right.has(stem));
};
const monthLabel = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(new Date(value));
const list = (items: string[]) =>
  items.length < 2 ? (items[0] ?? '') : `${items.slice(0, -1).join(', ')} et ${items.at(-1)}`;

export function profileReading(student: Student, need: Need, calendars: Calendar[]): Reading {
  const data = student.published!;
  const training = calendars.find((c) => c.id === data.trainingId)?.title.split(' · ')[0];
  const acquired = data.skills.filter((skill) => skill.status === 'acquired');
  const learning = data.skills.filter((skill) => skill.status === 'learning');
  const missions: MissionLink[] = briefMissions(need).map((mission) => {
    const skill = acquired.find((item) => overlaps(mission, item.name));
    if (skill) return { mission, status: 'acquired', label: `Compétence acquise : ${skill.name}` };
    if (data.experience && overlaps(mission, data.experience))
      return { mission, status: 'experience', label: 'Expérience identifiée' };
    const next = learning.find((item) => overlaps(mission, item.name));
    if (next) return { mission, status: 'learning', label: `En cours d’acquisition : ${next.name}` };
    return { mission, status: 'unknown', label: 'À explorer avec le conseiller' };
  });
  const linked = missions.filter((item) => item.status !== 'unknown');
  const sentences = [
    linked.length
      ? `${data.firstName} présente des points d’appui pour ${linked.length} de vos ${missions.length} missions : ${list(linked.map((item) => item.mission.toLocaleLowerCase('fr')))}.`
      : `Le parcours de ${data.firstName} ne montre pas encore de lien direct avec vos missions ; votre conseiller peut préciser ce qui est transférable.`,
    acquired.length
      ? `${training ? `En ${training}, ` : ''}${data.firstName} a validé : ${list(acquired.slice(0, 3).map((skill) => skill.name.toLocaleLowerCase('fr')))}.`
      : '',
    // Les observations du conseiller sont reprises telles quelles, sans en tirer de qualité.
    data.note
      ? `Le centre de formation indique : ${data.note.charAt(0).toLocaleLowerCase('fr')}${data.note.slice(1).replace(/\.?$/, '.')}`
      : '',
  ].filter(Boolean);
  const highlights = [
    ...acquired.slice(0, 2).map((skill) => skill.name),
    data.license === 'yes' ? 'Permis B' : '',
    data.availableFrom ? `Disponible dès ${monthLabel(data.availableFrom)}` : '',
  ]
    .filter(Boolean)
    .slice(0, 4);
  return {
    why: sentences.slice(0, 3).join(' '),
    highlights,
    proven: [
      ...acquired.map((skill) => skill.name),
      ...(data.experience ? [data.experience] : []),
    ],
    transferable: learning.map((skill) => skill.name),
    missions,
    declic: student.discoveryReason,
  };
}
