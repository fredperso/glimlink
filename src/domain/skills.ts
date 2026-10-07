export const SKILL_LEVELS = {
  unknown: 'À évaluer',
  beginner: 'Notions',
  intermediate: 'Pratique accompagnée',
  autonomous: 'Autonome',
  advanced: 'Maîtrise avancée',
} as const;
export type SkillLevel = keyof typeof SKILL_LEVELS;
export type StudentSkill = {
  id: string;
  name: string;
  level: SkillLevel;
  status: 'acquired' | 'learning';
  trainingId: string | null;
};
export type TrainingSkill = { id: string; name: string; targetLevel: SkillLevel };
export function skillKey(name: string): string {
  return name
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .replace(/\s+/g, ' ');
}
// Les anciennes compétences textuelles gardent leur nom et un niveau inconnu.
export function normalizeSkills(input: unknown): StudentSkill[] {
  if (!Array.isArray(input)) return [];
  const keys = new Set<string>();
  return input.flatMap((item, index) => {
    const name =
      typeof item === 'string'
        ? item.trim()
        : typeof item?.name === 'string'
          ? item.name.trim()
          : '';
    const key = skillKey(name);
    if (!name || keys.has(key)) return [];
    keys.add(key);
    return [
      {
        id: typeof item?.id === 'string' ? item.id : `legacy-${index}-${key}`,
        name,
        level:
          typeof item?.level === 'string' && Object.hasOwn(SKILL_LEVELS, item.level)
            ? item.level
            : 'unknown',
        status: item?.status === 'learning' ? 'learning' : 'acquired',
        trainingId: typeof item?.trainingId === 'string' ? item.trainingId : null,
      } as StudentSkill,
    ];
  });
}
export function addSkill(skills: StudentSkill[], skill: StudentSkill): StudentSkill[] {
  return skills.some((item) => skillKey(item.name) === skillKey(skill.name))
    ? skills
    : [...skills, skill];
}
export const TRAINING_SKILLS: Record<string, TrainingSkill[]> = {
  gpm: [
    { id: 'gpm-devis', name: 'Gestion de devis', targetLevel: 'autonomous' },
    { id: 'gpm-facturation', name: 'Facturation', targetLevel: 'autonomous' },
    { id: 'gpm-tableaux', name: 'Tableaux de bord', targetLevel: 'intermediate' },
  ],
  mco: [
    { id: 'mco-relation', name: 'Relation client', targetLevel: 'autonomous' },
    { id: 'mco-stock', name: 'Gestion de stock', targetLevel: 'autonomous' },
    { id: 'mco-merchandising', name: 'Merchandising', targetLevel: 'intermediate' },
  ],
  com: [
    { id: 'com-redaction', name: 'Rédaction', targetLevel: 'autonomous' },
    { id: 'com-social', name: 'Animation des réseaux sociaux', targetLevel: 'autonomous' },
    { id: 'com-contenu', name: 'Création de contenu', targetLevel: 'intermediate' },
  ],
  ndrc: [
    { id: 'ndrc-prospection', name: 'Prospection', targetLevel: 'autonomous' },
    { id: 'ndrc-crm', name: 'Gestion d’un CRM', targetLevel: 'autonomous' },
    { id: 'ndrc-negociation', name: 'Négociation commerciale', targetLevel: 'intermediate' },
  ],
};
