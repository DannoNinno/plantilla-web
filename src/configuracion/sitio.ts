export interface ConfiguracionSitio {
  nombre: string;
  persona: string;
  descripcion: string;
  logo: string;
  colores: {
    tinta: string;
    celeste: string;
    celesteTexto: string;
    coral: string;
    coralOscuro: string;
    fondo: string;
  };
  contacto: {whatsapp: string; correo: string};
  paquete: string;
  componentes: Record<string, boolean>;
}

export const sitio: ConfiguracionSitio = {
  nombre: 'dannotech',
  persona: 'Daniel Salamanca',
  descripcion: 'Sitios web para pymes chilenas, listos para administrar por tu cuenta.',
  logo: '/dannotech-kit/svg/dannotech-imagotipo-horizontal-fondo-oscuro.svg',
  colores: {
    tinta: '#04182F',
    celeste: '#22C3F5',
    celesteTexto: '#0B84B8',
    coral: '#FF6B4A',
    coralOscuro: '#F04E2B',
    fondo: '#F7FAFC',
  },
  contacto: {
    whatsapp: '',
    correo: '',
  },
  paquete: 'portal',
  componentes: {},
};
