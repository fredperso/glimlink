// Entreprises et contacts fictifs destinés à la présentation du vivier partenaire.
export type PartnerCompany = {
  id: string;
  email: string;
  name: string;
  mark: string;
  sector: string;
  location: string;
  contact: string;
  position: string;
  school?: string;
  schools?: string[];
  status?: 'invited' | 'verification' | 'active';
  phone?: string;
  siret?: string;
  address?: string;
  adviserId?: string;
  registeredAt?: string;
  registrationNotificationRead?: boolean;
};
export const partnerCompanies: PartnerCompany[] = [
  {
    id: 'maison-alba',
    email: 'camille@example.com',
    name: 'Maison Alba',
    mark: 'ma.',
    sector: 'Services aux entreprises',
    location: 'Montpellier',
    contact: 'Camille Martin',
    position: 'Responsable d’entreprise',
  },
  {
    id: 'atelier-rivage',
    email: 'atelier-rivage@example.com',
    name: 'Atelier Rivage',
    mark: 'ar.',
    sector: 'Architecture & aménagement',
    location: 'Castelnau-le-Lez',
    contact: 'Élodie Fabre',
    position: 'Gérante',
  },
  {
    id: 'bloom-studio',
    email: 'bloom-studio@example.com',
    name: 'Bloom Studio',
    mark: 'bs.',
    sector: 'Communication & création',
    location: 'Montpellier',
    contact: 'Thomas Vidal',
    position: 'Directeur de l’agence',
  },
  {
    id: 'comptoir-oliviers',
    email: 'comptoir-oliviers@example.com',
    name: 'Le Comptoir des Oliviers',
    mark: 'co.',
    sector: 'Commerce & distribution',
    location: 'Lattes',
    contact: 'Sarah Morel',
    position: 'Responsable de boutique',
  },
  {
    id: 'nova-services',
    email: 'nova-services@example.com',
    name: 'Nova Services',
    mark: 'ns.',
    sector: 'Conseil & gestion administrative',
    location: 'Saint-Jean-de-Védas',
    contact: 'Julien Roche',
    position: 'Responsable des opérations',
  },
  {
    id: 'horizon-mobilite',
    email: 'horizon-mobilite@example.com',
    name: 'Horizon Mobilité',
    mark: 'hm.',
    sector: 'Transport & logistique',
    location: 'Mauguio',
    contact: 'Nadia Benali',
    position: 'Responsable des ressources humaines',
  },
];
