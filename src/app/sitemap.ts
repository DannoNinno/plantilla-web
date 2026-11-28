import type {MetadataRoute} from 'next';
import {URL_SITIO} from '../domain/configuracion/sitioWeb';
import {getPaquetesHabilitados, getSitio} from '../infrastructure/handlers/datos';

export default function sitemap(): MetadataRoute.Sitemap {
  const catalogo = getSitio().catalogoHabilitado
    ? ['/catalogo/', ...getPaquetesHabilitados().map((paquete) => `/catalogo/${paquete.id}/`)]
    : [];
  return ['/', ...catalogo, '/perfil/', '/contacto/', '/privacidad/'].map((ruta) => ({
    url: `${URL_SITIO}${ruta}`,
  }));
}
