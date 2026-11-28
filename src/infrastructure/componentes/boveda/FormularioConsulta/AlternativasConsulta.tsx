import type {ConfiguracionConsulta} from '../../../../domain/types/consulta';
import {enlaceWhatsapp} from '../../../../domain/servicios/consulta';

export default function AlternativasConsulta({config}: {config: ConfiguracionConsulta}) {
  const whatsapp = enlaceWhatsapp(config);
  return (
    <p className="text-sm leading-relaxed">
      También puedes{' '}
      <a className="underline" href={`mailto:${config.correoContacto}`}>
        escribirme directamente al correo
      </a>
      {whatsapp && (
        <>
          {' '}
          o{' '}
          <a className="underline" href={whatsapp}>
            contactarme por WhatsApp
          </a>
        </>
      )}
      . Consulta la{' '}
      <a className="underline" href="/privacidad/">
        política de privacidad
      </a>
      .
    </p>
  );
}
