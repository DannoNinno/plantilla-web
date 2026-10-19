export const nombresIconos = [
  'LayoutTemplate',
  'BriefcaseBusiness',
  'Store',
  'Images',
  'MessageSquareQuote',
  'CircleHelp',
  'MapPin',
  'Share2',
  'MessageCircle',
  'Mail',
  'PanelBottom',
  'LayoutDashboard',
  'Newspaper',
  'LayoutGrid',
  'Megaphone',
  'Building2',
  'Users',
  'ListChecks',
  'Search',
] as const;

export const planesVitrina = ['landing', 'portal'] as const;

export type NombreIcono = (typeof nombresIconos)[number];
export type PlanVitrina = (typeof planesVitrina)[number];

export interface ComponenteVitrina {
  id: string;
  nombre: string;
  icono: NombreIcono;
  descripcion: string;
  planMinimo: PlanVitrina;
  destacado: boolean;
  revisionDescripcion: string;
}

export interface ElementoVitrina {
  componente: ComponenteVitrina;
  incluido: boolean;
  nombrePlanMinimo: string;
}

export interface TextosTarjetaComponente {
  incluidoEn: string;
  incluidoSinPlan: string;
  disponibleDesde: string;
  disponibleSinPlan: string;
  componenteClave: string;
}
