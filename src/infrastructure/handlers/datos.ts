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
import type {DefinicionComponente} from '../../domain/types/componentes';

export function getSitio(): ConfiguracionSitio {
  return sitio;
}

export function getPerfil(): Perfil {
  return perfil;
}

export function getPaquetes(): Paquete[] {
  return paquetes;
}

export function getCatalogo(): CatalogoServicios {
  return catalogo;
}

export function getPaquete(id: string) {
  return getPaquetes().find((paquete) => paquete.id === id);
}

export function getComponentes(): DefinicionComponente[] {
  return componentes;
}

export function getNavegacion(): Navegacion {
  return navegacion;
}
