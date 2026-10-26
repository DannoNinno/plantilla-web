import {CONTACT_EMAIL, PRIVACY_VERSION} from '@/domain/configuracion/contacto';
import {enlaceCorreo} from '@/domain/servicios/contacto';

export const metadata = {
  title: 'Política de privacidad',
  description: 'Cómo trato los datos de consultas y cotizaciones recibidas en dannotech.',
};

export default function PrivacidadPage() {
  return (
    <article className="mx-auto max-w-3xl space-y-8 px-6 py-12 leading-relaxed">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold">Política de privacidad</h1>
        <p>Última actualización: {PRIVACY_VERSION}.</p>
      </header>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Responsable y contacto</h2>
        <p>
          Soy Daniel Salamanca Jorquera, responsable de dannotech y del tratamiento de los datos que
          recibo a través de este sitio. Puedes contactarme en{' '}
          <a className="underline" href={enlaceCorreo(CONTACT_EMAIL)}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Datos y finalidad</h2>
        <p>
          El formulario guarda tu nombre, tipo de solicitud, plan elegido cuando corresponde y
          mensaje, junto con la fecha, versión de la política que autorizaste, estado de revisión y
          resultado de los avisos internos. El servidor recibe la IP y conserva una versión
          transformada mediante hash con sal para limitar abusos. La API admite un teléfono
          opcional, aunque la interfaz no lo pide.
        </p>
        <p>
          Uso estos datos para recibir, organizar y revisar consultas o cotizaciones, atender las
          comunicaciones que tú inicias y proteger el sitio del spam. No los uso para publicidad ni
          los vendo. No incluyas datos sensibles o de otras personas sin autorización.
        </p>
        <p>
          El formulario actual no solicita email y no permite responderte por ese medio. Si
          necesitas una respuesta, utiliza el correo oficial. En ese caso recibiré tu dirección y el
          contenido que envíes. Los registros de versiones anteriores pueden conservar direcciones
          de correo.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Decisión de enviar y fundamento del tratamiento</h2>
        <p>
          Enviar una consulta es voluntario. Para hacerlo debes autorizar expresamente el
          tratamiento mediante una casilla no premarcada. Guardo la versión de esta política junto
          con la fecha de la solicitud como constancia de esa autorización. Trato la información que
          proporcionas para atender esa solicitud; cuando corresponde, también para gestionar
          actuaciones previas a un contrato o cumplir las obligaciones aplicables a una relación
          contractual.
        </p>
        <p>
          Puedes retirar tu consentimiento mediante el correo del responsable, sin afectar el
          tratamiento realizado previamente ni las obligaciones legales de conservación que
          correspondan. El envío del formulario no autoriza usos publicitarios ni otros fines ajenos
          a tu solicitud.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Proveedores y ubicación de los datos</h2>
        <p>
          Cloudflare proporciona el alojamiento, la base D1, la infraestructura de correo y las
          funciones de seguridad. Los avisos internos llegan a un buzón Gmail de Google y pueden
          incluir el contenido de tu solicitud. Estos proveedores operan infraestructura
          internacional, por lo que los datos pueden tratarse fuera de Chile según sus servicios y
          condiciones.
        </p>
        <p>
          Solo utilizo la información para las finalidades indicadas y limito el acceso a la
          administración del sitio y a los proveedores necesarios para operarlo. También podría
          comunicarla cuando exista una obligación legal.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Conservación</h2>
        <p>
          Conservaré las consultas y cotizaciones que no deriven en contrato durante un máximo de
          doce meses desde el último contacto. Los datos de clientes se conservarán durante los
          plazos necesarios para cumplir las obligaciones contractuales y legales aplicables.
        </p>
        <p>
          Esta política comprende los registros históricos y los avisos guardados en Gmail. La
          revisión y eliminación son manuales, no automáticas. Los respaldos se mantienen con acceso
          restringido durante su ciclo de recuperación y se revisan para no prolongar
          innecesariamente la conservación. Si un respaldo se restaura, se deben volver a aplicar
          las solicitudes de eliminación atendidas.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Tus derechos</h2>
        <p>
          Puedes solicitar información sobre tus datos, acceso, rectificación, eliminación o
          cancelación y oposición, así como retirar un consentimiento cuando corresponda. También
          puedes ejercer los demás derechos que reconozca la normativa vigente, incluida la
          portabilidad cuando sea aplicable.
        </p>
        <p>
          Escríbeme al correo indicado al inicio, describe tu solicitud y aporta solo la información
          necesaria para identificarla. Si necesito verificar tu identidad, te pediré lo mínimo
          indispensable. No envíes documentos sensibles sin que sean necesarios.
        </p>
        <p>
          Esta información considera la Ley 19.628 de Chile y la transición a la Ley 21.719, cuya
          entrada en vigor está prevista para el 1 de diciembre de 2026. Actualizaré la política
          cuando cambie el tratamiento o la normativa aplicable.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Cookies y seguridad</h2>
        <p>
          No utilizo Google Analytics, píxeles publicitarios ni cookies de marketing. El panel
          privado usa una cookie técnica de sesión, sesion_formularios, con vencimiento de ocho
          horas. No es necesaria para enviar una consulta pública. La infraestructura puede procesar
          datos técnicos para seguridad y funcionamiento.
        </p>
        <p>
          Uso HTTPS, controles de acceso y límites contra abuso. Estas medidas reducen riesgos, pero
          ningún servicio puede garantizar seguridad absoluta. Las consultas sobre privacidad o
          incidentes pueden dirigirse al correo del responsable.
        </p>
      </section>
    </article>
  );
}
