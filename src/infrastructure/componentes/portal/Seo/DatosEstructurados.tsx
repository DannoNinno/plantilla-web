import {getSitio} from '../../../handlers/datos';
import {consultaConfig} from '../../../../domain/configuracion/consulta';
import {CONTACT_EMAIL} from '../../../../domain/configuracion/contacto';
import {URL_SITIO} from '../../../../domain/configuracion/sitioWeb';

export default function DatosEstructurados() {
  const sitio = getSitio();
  const negocio = `${URL_SITIO}/#negocio`;
  const datos = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': negocio,
        name: consultaConfig.negocio,
        url: `${URL_SITIO}/`,
        description: sitio.descripcion,
        logo: `${URL_SITIO}/apple-touch-icon.png`,
        image: `${URL_SITIO}/og-image.png`,
        email: CONTACT_EMAIL,
        telephone: `+${sitio.whatsapp.replace(/\D/g, '')}`,
        founder: {'@type': 'Person', name: sitio.persona},
      },
      {
        '@type': 'WebSite',
        '@id': `${URL_SITIO}/#sitio`,
        name: consultaConfig.negocio,
        url: `${URL_SITIO}/`,
        inLanguage: 'es',
        publisher: {'@id': negocio},
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(datos).replace(/</g, '\\u003c')}}
    />
  );
}
