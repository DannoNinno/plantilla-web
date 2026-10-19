import sitio from '../../data/sitio.json';
import perfil from '../../data/perfil.json';
import paquetes from '../../data/paquetes.json';
import catalogo from '../../data/catalogo.json';
import componentes from '../../data/componentes.json';
import navegacion from '../../data/navegacion.json';
import type {ConfiguracionSitio, Navegacion} from '../../domain/types/sitio';
import type {Perfil} from '../../domain/types/perfil';
import type {Paquete} from '../../domain/types/paquete';
import type {CatalogoServicios} from '../../domain/types/catalogo';
import {nombresIconos, planesVitrina} from '../../domain/types/componentes';
import type {ComponenteVitrina} from '../../domain/types/componentes';

export function getSitio(): ConfiguracionSitio {
  return sitio;
}

export function getPerfil(): Perfil {
  return perfil;
}

export function getPaquetes(): Paquete[] {
  return paquetes;
}

export function getPaquetesHabilitados(): Paquete[] {
  return getPaquetes().filter((paquete) => paquete.habilitado);
}

export function getCatalogo(): CatalogoServicios {
  return catalogo;
}

export function getComponentes(): ComponenteVitrina[] {
  return componentes.map((componente) => {
    const icono = nombresIconos.find((nombre) => nombre === componente.icono);
    const planMinimo = planesVitrina.find((id) => id === componente.planMinimo);
    if (!icono || !planMinimo) {
      throw new Error(`Icono o plan minimo invalido en el componente: ${componente.id}`);
    }
    return {...componente, icono, planMinimo};
  });
}

export function getPaquete(id: string) {
  return getPaquetesHabilitados().find((paquete) => paquete.id === id);
}

export function getNavegacion(): Navegacion {
  return navegacion;
}
