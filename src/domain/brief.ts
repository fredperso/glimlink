import { DAYS, LEVELS, createId, type Calendar, type Day, type Level, type Need } from './model.ts';

// Reformulation simulée du besoin (V6 §4-6) : quelques règles lisibles remplacent l’IA.
// Elle propose, l’entreprise confirme ; aucune contrainte n’est ajoutée sans être écrite.

export const LANGUAGES = ['Anglais', 'Espagnol', 'Allemand', 'Italien'] as const;
export const LANGUAGE_LEVELS = ['A2', 'B1', 'B2', 'C1'] as const;
export const MIN_MISSIONS = 3;

const SKILL_RULES: [RegExp, string][] = [
  [/accueil/i, 'Accueil'],
  [/client/i, 'Relation client'],
  [/administr/i, 'Gestion administrative'],
  [/relance|prospect|commercial/i, 'Prospection'],
  [/\bvente\b|\bvendre\b|boutique/i, 'Vente'],
  [/r[ée]dig|contenu/i, 'Rédaction'],
  [/r[ée]seaux sociaux|publication/i, 'Réseaux sociaux'],
  [/excel|tableau/i, 'Excel'],
  [/organis|planning|agenda/i, 'Organisation'],
];
const DOMAIN_RULES: [RegExp, string][] = [
  [/administr|devis|factur/i, 'Gestion administrative'],
  [/client|commercial|vente|boutique|relance/i, 'Commerce'],
  [/communication|contenu|publication|r[ée]seaux/i, 'Communication'],
];
const TRAINING_RULES: [RegExp, string][] = [
  [/communication|contenu|publication/i, 'com'],
  [/administr|devis|accueil|factur/i, 'gpm'],
  [/prospect|n[ée]gociation|relance/i, 'ndrc'],
  [/boutique|commande|magasin/i, 'mco'],
];
const PATTERN_MISSIONS: [RegExp, string[]][] = [
  [
    /communication|contenu|publication/i,
    [
      'Rédiger des contenus',
      'Préparer les publications sur les réseaux sociaux',
      'Suivre les retours des publications',
    ],
  ],
  [
    /boutique|commande/i,
    ['Conseiller les clients', 'Suivre les commandes', 'Mettre à jour le suivi commercial'],
  ],
  [
    /devis|accueil/i,
    [
      'Accueillir et renseigner les clients',
      'Préparer et suivre les devis',
      'Accompagner la gestion administrative',
    ],
  ],
];
const OBLIGATION = /obligatoire|imp[ée]ratif|indispensable|doit|faut|faudrait|pr[ée]sente?\b/i;
const WISH = /utile|souhait|id[ée]alement|serait|si possible|appr[ée]ci/i;

// Fragments qui précisent le contexte (langue, période, lieu) sans décrire une mission.
const NOT_A_MISSION = /^(?:anglais|espagnol|allemand|italien|pour la rentr|d[èe]s que possible|en (?:alternance|stage)|à |le |la |les )/i;

const capitalize = (value: string) => value.charAt(0).toLocaleUpperCase('fr') + value.slice(1);
const sentences = (text: string) => text.split(/(?<=[.!?])\s+|\n+/).filter(Boolean);

// Les missions sont reprises des mots de l’entreprise : « pour A, B et C ».
export function extractMissions(description: string): string[] {
  const match = description.match(/\bpour\s+(.+?)(?:[.!?](?:\s|$)|$)/is);
  if (!match) return [];
  return match[1]
    .split(/\s*,\s*|\s+et\s+/)
    .map((part) =>
      part
        .trim()
        .replace(/^(?:faire|effectuer)\s+de\s+l[’']/i, 'Assurer l’')
        .replace(/^m[’']aider\s+à\s+/i, '')
        .replace(/^m[’']aider\s+(?:sur|dans|pour)\s+/i, 'Contribuer à ')
        .replace(/\s+à\s+\p{Lu}[\p{L}-]+$/u, '')
        .replace(/\b(?:mes|nos)\b/gi, 'les')
        .replace(/\bmon\b/gi, 'le')
        .replace(/\bma\b/gi, 'la'),
    )
    .filter((part) => part.length >= 8 && !NOT_A_MISSION.test(part))
    .map(capitalize);
}

export function detectPresence(description: string): { required: Day[]; wished: Day[] } {
  const required = new Set<Day>();
  const wished = new Set<Day>();
  for (const sentence of sentences(description))
    for (const day of DAYS)
      if (new RegExp(`\\b${day}s?\\b`, 'i').test(sentence)) {
        if (WISH.test(sentence)) wished.add(day);
        else if (OBLIGATION.test(sentence)) required.add(day);
        else wished.add(day);
      }
  return { required: [...required], wished: [...wished] };
}

export function nextIntake(today: string): { start: string; end: string } {
  const [year, month] = today.split('-').map(Number);
  const intakeYear = month < 8 ? year : year + 1;
  return { start: `${intakeYear}-09-01`, end: `${intakeYear + 1}-06-30` };
}

export function proposeBrief(
  description: string,
  context: {
    companyId: string;
    sites: string[];
    places: string[];
    calendars: Pick<Calendar, 'id'>[];
    today?: string;
  },
): Need {
  const text = description.trim();
  const today = context.today ?? new Date().toISOString().slice(0, 10);
  const extracted = extractMissions(text);
  const pattern = PATTERN_MISSIONS.find(([rule]) => rule.test(text))?.[1] ?? [];
  const missions = extracted.length >= MIN_MISSIONS ? extracted : pattern.length ? pattern : extracted;
  const { required, wished } = detectPresence(text);
  const domains = DOMAIN_RULES.filter(([rule]) => rule.test(text)).map(([, domain]) => domain);
  const levels = LEVELS.filter((level) =>
    new RegExp(level.replace('+', '\\+'), 'i').test(text),
  ) as Level[];
  const language = LANGUAGES.find((name) => new RegExp(name, 'i').test(text));
  const languageLevel =
    text.match(/\b(A2|B1|B2|C1)\b/)?.[1] ?? (language && /courant/i.test(text) ? 'B2' : undefined);
  const nextYear = /rentr[ée]e|septembre/i.test(text);
  const period = nextYear ? nextIntake(today) : { start: today, end: '2027-06-30' };
  const mentioned = [...context.sites, ...context.places].find((place) =>
    new RegExp(`\\b${place}\\b`, 'i').test(text),
  );
  const trainingId = TRAINING_RULES.find(
    ([rule, id]) => rule.test(text) && context.calendars.some((calendar) => calendar.id === id),
  )?.[1];
  const title =
    domains.includes('Communication')
      ? 'Communication & contenus'
      : domains.includes('Gestion administrative') && domains.includes('Commerce')
        ? /accueil/i.test(text)
          ? 'Accueil & gestion administrative'
          : 'Gestion administrative & relation client'
        : domains.includes('Gestion administrative')
          ? 'Gestion administrative'
          : domains.includes('Commerce')
            ? 'Relation client & suivi commercial'
            : 'Missions à préciser';
  return {
    id: createId(),
    companyId: context.companyId,
    mobility: '',
    proposedSkills: [...new Set(SKILL_RULES.filter(([rule]) => rule.test(text)).map(([, n]) => n))],
    proposedDomains: domains,
    title,
    description: text,
    contract: /stag/i.test(text) ? 'Stage' : 'Alternance',
    location: mentioned ?? context.sites[0] ?? '',
    ...period,
    availability: nextYear ? 'next-intake' : 'immediate',
    requiredDays: required,
    licenseRequired: /permis/i.test(text) && !/(pas|sans|non)\s+(?:\S+\s+){0,2}permis/i.test(text),
    // Sans niveau écrit, tous les niveaux restent acceptés : rien n’est restreint par défaut.
    levels: levels.length ? levels : [...LEVELS],
    language,
    languageLevel: language ? languageLevel : undefined,
    suggestedTrainingId: trainingId,
    missions,
    wishes: wished.map((day) => `Présence le ${day.toLowerCase()} souhaitable`).join(' ; '),
    schools: ['campus-a'],
    status: 'active',
    validated: false,
    selected: [],
    passed: [],
  };
}

export const briefMissions = (need: Pick<Need, 'missions'>) =>
  need.missions.map((mission) => mission.trim()).filter(Boolean);
