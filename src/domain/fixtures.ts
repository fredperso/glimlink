import { partnerCompanies } from './partners.ts';
import type { Store, StudentDetails, Student } from './model.ts';
import { normalizeSkills, TRAINING_SKILLS } from './skills.ts';

const details = (
  firstName: string,
  trainingId: string,
  skills: string[],
  more: Partial<StudentDetails> = {},
): StudentDetails => ({
  firstName,
  trainingId,
  skills: [
    ...normalizeSkills(skills).map((skill, index) => ({
      ...skill,
      level: (['autonomous', 'intermediate', 'beginner'] as const)[index % 3],
    })),
    ...(TRAINING_SKILLS[trainingId]
      ?.filter((item) => !skills.includes(item.name))
      .slice(-1)
      .map((item) => ({
        id: `demo-${item.id}`,
        name: item.name,
        level: 'beginner' as const,
        status: 'learning' as const,
        trainingId,
      })) ?? []),
  ],
  location: 'Montpellier',
  license: 'yes',
  availableFrom: '2026-10-01',
  unavailableDays: [],
  experience:
    'Accueil des clients, suivi des demandes et organisation au quotidien lors d’une expérience en entreprise.',
  note: 'Projet professionnel vérifié lors d’un échange avec le conseiller.',
  ...more,
});
const student = (
  id: string,
  draft: StudentDetails,
  avatar: number,
  more: Partial<Student> = {},
): Student => ({
  id,
  draft,
  published: structuredClone(draft),
  status: 'published',
  school: 'campus-a',
  validatedAt: '2026-10-06T09:00:00Z',
  validatedBy: 'Mathilde JEANNE',
  adviserId: 'mathilde-jeanne',
  avatar,
  personalDetails: {
    lastName:
      (
        {
          sophie: 'DURAND',
          lucas: 'MOREAU',
          ines: 'BERNARD',
          nora: 'PETIT',
          adam: 'GARNIER',
          leo: 'ROUSSEAU',
          maya: 'SIMON',
          'draft-zoe': 'LAMBERT',
        } as Record<string, string>
      )[id] ?? 'DÉMONSTRATION',
    email: `${id}@example.com`,
    phone: '+33 0 00 00 00 00',
    address: '12 rue de Démonstration',
    postalCode: '34000',
    city: 'Montpellier',
  },
  ...more,
});

export function initialStore(): Store {
  return {
    version: 1,
    companies: structuredClone(partnerCompanies),
    activeCompanyId: 'maison-alba',
    calendars: [
      {
        id: 'gpm',
        learningSkills: TRAINING_SKILLS.gpm,
        title: 'BTS Gestion de la PME · Promotion 2026',
        school: 'campus-a',
        courseDays: ['Lundi', 'Mardi'],
        mode: 'weekly',
        start: '2026-09-01',
        end: '2027-08-31',
      },
      {
        id: 'mco',
        learningSkills: TRAINING_SKILLS.mco,
        title: 'BTS Management commercial opérationnel',
        school: 'campus-a',
        courseDays: ['Mercredi', 'Jeudi'],
        mode: 'weekly',
        start: '2026-09-01',
        end: '2027-08-31',
      },
      {
        id: 'com',
        learningSkills: TRAINING_SKILLS.com,
        title: 'Bachelor Communication · Promotion 2026',
        school: 'campus-a',
        courseDays: [],
        mode: 'variable',
        start: '2026-09-01',
        end: '2027-08-31',
      },
      {
        id: 'ndrc',
        learningSkills: TRAINING_SKILLS.ndrc,
        title: 'BTS Négociation et digitalisation de la relation client',
        school: 'campus-a',
        courseDays: ['Jeudi', 'Vendredi'],
        mode: 'weekly',
        start: '2026-09-01',
        end: '2027-08-31',
      },
    ],
    students: [
      student(
        'sophie',
        details('Sophie', 'gpm', ['Relation client', 'Gestion de devis', 'Organisation'], {
          experience:
            '6 mois en accueil dans une entreprise de services. Préparation de devis, suivi des dossiers clients et gestion des rendez-vous.',
        }),
        0,
      ),
      student(
        'lucas',
        details('Lucas', 'mco', ['Relation client', 'Suivi commercial', 'Excel'], {
          location: 'Lattes',
          experience:
            'Une année en boutique : conseil aux clients, suivi des commandes et mise à jour de tableaux de bord.',
        }),
        1,
      ),
      student(
        'ines',
        details('Inès', 'gpm', ['Gestion administrative', 'Excel', 'Facturation'], {
          location: 'Castelnau-le-Lez',
        }),
        2,
      ),
      student('nora', details('Nora', 'gpm', ['Accueil', 'Gestion de devis', 'Planification']), 3),
      student(
        'adam',
        details('Adam', 'mco', ['Relation client', 'Organisation', 'Gestion de stock'], {
          experience:
            'Organisation de trois événements associatifs : accueil du public, coordination des bénévoles et suivi des prestataires.',
        }),
        4,
        {
          discoveryReason:
            'Son expérience événementielle mobilise l’accueil et l’organisation nécessaires à vos missions.',
        },
      ),
      student(
        'leo',
        details('Léo', 'ndrc', ['Prospection', 'Relation client', 'Suivi commercial']),
        5,
      ),
      student(
        'maya',
        details('Maya', 'com', ['Communication', 'Rédaction', 'Relation client'], {
          license: 'unknown',
        }),
        2,
      ),
      student('draft-zoe', details('Zoé', 'gpm', ['Excel', 'Accueil'], { license: 'unknown' }), 3, {
        status: 'draft',
        published: null,
        validatedAt: null,
      }),
      student('withdrawn', details('Talent retiré', 'gpm', ['Accueil']), 0, {
        status: 'withdrawn',
      }),
      student('other-campus', details('Profil de test', 'gpm', ['Accueil']), 0, {
        school: 'campus-b',
      }),
    ],
    needs: [
      {
        id: 'need-admin',
        companyId: 'maison-alba',
        title: 'Accueil & gestion administrative',
        description:
          'J’ai besoin de quelqu’un pour accueillir mes clients, gérer des devis et m’aider sur l’administratif. Il faudrait qu’il soit présent le vendredi et qu’il ait le permis.',
        contract: 'Alternance',
        location: 'Montpellier',
        start: '2026-11-02',
        end: '2027-06-30',
        requiredDays: ['Vendredi'],
        licenseRequired: true,
        missions: [
          'Accueillir et renseigner les clients',
          'Préparer et suivre les devis',
          'Accompagner la gestion administrative',
        ],
        wishes: 'Une première expérience de la relation client serait un plus.',
        schools: ['campus-a'],
        status: 'active',
        validated: true,
        selected: ['lucas', 'ines'],
        passed: [],
      },
      {
        id: 'need-sales',
        title: 'Développement commercial',
        description:
          'Un stagiaire pour renforcer la relation client et suivre les demandes commerciales.',
        contract: 'Stage',
        location: 'Montpellier',
        start: '2026-11-02',
        end: '2027-02-26',
        requiredDays: [],
        licenseRequired: false,
        missions: ['Suivre les demandes commerciales', 'Conseiller les clients'],
        wishes: '',
        schools: ['campus-a'],
        status: 'active',
        validated: true,
        selected: [],
        passed: [],
      },
      {
        id: 'need-bloom',
        companyId: 'bloom-studio',
        title: 'Communication & contenus',
        description: 'Préparer des contenus et accompagner les publications de notre agence.',
        missions: ['Rédiger des contenus', 'Préparer les publications sur les réseaux sociaux'],
        proposedSkills: ['Rédaction', 'Communication digitale'],
        proposedDomains: ['Communication'],
        contract: 'Stage',
        location: 'Montpellier',
        start: '2026-11-02',
        end: '2027-02-26',
        requiredDays: [],
        licenseRequired: false,
        wishes: 'Intérêt pour la création',
        schools: ['campus-a'],
        status: 'active',
        validated: true,
        selected: [],
        passed: [],
      },
    ],
    requests: [],
    alerts: [
      {
        id: 'alert-nora',
        needId: 'need-admin',
        studentId: 'nora',
        read: false,
        date: '2026-10-07T08:30:00Z',
      },
    ],
  };
}
