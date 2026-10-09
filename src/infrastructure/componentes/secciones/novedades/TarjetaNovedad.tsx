import ImagenContenido from '../../base/ImagenContenido/ImagenContenido';
import type {Novedad} from './tipos';
export default function TarjetaNovedad({titulo, descripcion, fecha, imagen}: Novedad) {
  return (
    <li className="min-w-0 rounded-2xl bg-white p-5">
      <article>
        {imagen && <ImagenContenido imagen={imagen} />}
        {fecha && <p className="mt-4 break-words text-sm">{fecha}</p>}
        <h3 className="mt-4 break-words text-xl font-bold">{titulo}</h3>
        {descripcion && <p className="mt-3 break-words leading-relaxed">{descripcion}</p>}
      </article>
    </li>
  );
}
