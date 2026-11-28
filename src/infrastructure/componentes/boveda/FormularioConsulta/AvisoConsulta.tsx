import {avisoConsulta} from '../../../../domain/servicios/avisoConsulta';
import type {ConfiguracionConsulta} from '../../../../domain/types/consulta';

export default function AvisoConsulta({config}: {config: ConfiguracionConsulta}) {
  return (
    <ol className="space-y-5 break-words text-sm leading-relaxed">
      {avisoConsulta(config).map((punto) => (
        <li key={punto.titulo}>
          <h3 className="font-semibold">{punto.titulo}</h3>
          <p className="mt-1">{punto.texto}</p>
        </li>
      ))}
    </ol>
  );
}
