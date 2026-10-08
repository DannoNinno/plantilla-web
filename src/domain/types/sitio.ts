export interface ConfiguracionSitio {
  nombre: string;
  persona: string;
  descripcion: string;
  logo: string;
}

export interface EnlaceNavegacion {
  label: string;
  href: string;
}

export interface Navegacion {
  principal: EnlaceNavegacion[];
  pie: EnlaceNavegacion[];
}
