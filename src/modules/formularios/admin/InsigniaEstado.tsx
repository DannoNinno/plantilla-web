import type {EstadoAviso} from '../core/tipos';

export default function InsigniaEstado({estado}: {estado: EstadoAviso}) {
  const estilos = {
    enviado: 'bg-green-100 text-green-900',
    pendiente: 'bg-yellow-100 text-yellow-900',
    fallido: 'bg-red-100 text-red-900',
  };
  return (
    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${estilos[estado]}`}>
      {estado}
    </span>
  );
}
