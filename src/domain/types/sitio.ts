export interface ConfiguracionSitio {
  nombre: string;
  persona: string;
  descripcion: string;
  logo: string;
  catalogoHabilitado: boolean;
  demosHabilitadas: boolean;
  whatsapp: string;
  plazoRespuesta: string;
}

export interface EnlaceNavegacion {
  label: string;
  href: string;
}

export interface Navegacion {
  principal: EnlaceNavegacion[];
  pie: EnlaceNavegacion[];
}
