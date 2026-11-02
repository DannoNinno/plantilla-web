import type {Ref} from 'react';
import type {DatosConsulta} from '../../../../domain/types/consulta';
import Boton from '../Base/Boton/Boton';

export default function ConsultaEnviada({
  datos,
  referencia,
  reiniciar,
}: {
  datos: DatosConsulta;
  referencia: Ref<HTMLDivElement>;
  reiniciar: () => void;
}) {
  return (
    <div
      ref={referencia}
      tabIndex={-1}
      role="status"
      className="mt-6 space-y-5 rounded-xl border border-brand-ink/20 p-6"
    >
      <p>
        ¡Gracias, {datos.nombre}! Te contactaré por{' '}
        {datos.canal === 'whatsapp' ? 'WhatsApp' : datos.canal === 'llamada' ? 'llamada' : 'correo'}{' '}
        lo antes posible.
      </p>
      <Boton onClick={reiniciar}>Enviar otra consulta</Boton>
    </div>
  );
}
