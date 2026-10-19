import ImagenContenido from '../../base/ImagenContenido/ImagenContenido';
import type {PersonaEquipo} from './tipos';
export default function TarjetaPersona({nombre, rol, imagen}: PersonaEquipo) {
  return (
    <li className="min-w-0 rounded-2xl bg-white p-5">
      {imagen && <ImagenContenido imagen={imagen} sizes="(max-width: 767px) 100vw, 33vw" />}
      <h3 className="mt-4 break-words text-xl font-bold">{nombre}</h3>
      {rol && <p className="mt-2 break-words">{rol}</p>}
    </li>
  );
}
