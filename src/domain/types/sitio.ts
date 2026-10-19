export interface ConfiguracionSitio {
  nombre: string;
  persona: string;
  descripcion: string;
  descripcionCatalogo: string;
  inicio: {
    tituloHero: string;
    subtituloHero: string;
    verPlanes: string;
    queHagoTitulo: string;
    queHagoDescripcion: string;
    paraQuien: string;
    revisionParaQuien: string;
    revisionDescripcion: string;
    cotizar: string;
  };
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
