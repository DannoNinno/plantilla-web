import {consultaConfig} from '@/domain/configuracion/consulta';
import AvisoConsulta from '@/infrastructure/componentes/boveda/FormularioConsulta/AvisoConsulta';

export const metadata = {
  title: 'Política de privacidad',
  description: 'Cómo se tratan los datos de las consultas recibidas por correo.',
};

export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-12 leading-relaxed">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">Política de privacidad</h1>
        <p>Última actualización: {consultaConfig.aviso.fecha}.</p>
        <a className="underline" href={`mailto:${consultaConfig.correoContacto}`}>
          {consultaConfig.correoContacto}
        </a>
      </header>
      <AvisoConsulta config={consultaConfig} />
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Cookies y protección contra abusos</h2>
        <p>
          No utilizo cookies de publicidad. El panel privado utiliza una cookie técnica de sesión.
          El formulario utiliza un comprobante temporal firmado y contadores de frecuencia asociados
          a una clave derivada de la IP; no guardan el nombre, teléfono, correo ni mensaje.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Datos históricos y eliminación</h2>
        <p>
          El cambio al envío solo por correo no borra automáticamente registros de versiones
          anteriores. Los datos históricos siguen sujetos al aviso que se aceptó entonces y a las
          solicitudes de eliminación que correspondan. No se reciben nuevas consultas en esa base de
          datos.
        </p>
        <p>
          La eliminación de consultas del correo es manual e incluye sus copias y papelera. Estos
          textos no sustituyen una revisión legal de las obligaciones aplicables.
        </p>
      </section>
    </article>
  );
}
