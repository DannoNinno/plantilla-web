import Contenedor from '../../base/Contenedor/Contenedor';
import EnlaceSocial from './EnlaceSocial';
import type {RedesSocialesProps} from './tipos';

export default function RedesSociales({etiqueta, descripcion, enlaces = []}: RedesSocialesProps) {
  return (
    <nav aria-label={etiqueta} className="bg-seccion-tinta py-8 text-seccion-fondo">
      <Contenedor>
        <ul className="flex flex-wrap gap-3">
          {enlaces.map((enlace) => (
            <EnlaceSocial key={enlace.id} {...enlace} />
          ))}
        </ul>
        {descripcion && <p className="mt-3 break-words text-sm leading-relaxed">{descripcion}</p>}
      </Contenedor>
    </nav>
  );
}
