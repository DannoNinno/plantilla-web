import ImagenContenido from '../../base/ImagenContenido/ImagenContenido';
import Boton from '../../base/Boton/Boton';
import {formatoPrecioCLP} from '../../../../domain/servicios/precio';
import type {ProductoCatalogo} from './tipos';
export interface TarjetaProductoProps {
  producto: ProductoCatalogo;
  textoConsulta: string;
  hrefConsulta: string;
}
export default function TarjetaProducto({
  producto,
  textoConsulta,
  hrefConsulta,
}: TarjetaProductoProps) {
  return (
    <li className="flex min-w-0 flex-col rounded-2xl bg-white p-5">
      {producto.imagen && <ImagenContenido imagen={producto.imagen} />}
      <h3 className="mt-4 break-words text-xl font-bold">{producto.nombre}</h3>
      {producto.descripcion && (
        <p className="mt-3 flex-1 break-words leading-relaxed">{producto.descripcion}</p>
      )}
      {producto.precio !== undefined && (
        <p className="mt-4 font-semibold">{formatoPrecioCLP(producto.precio)}</p>
      )}
      <div className="mt-5">
        <Boton href={hrefConsulta} variante="seccion">
          {textoConsulta}
        </Boton>
      </div>
    </li>
  );
}
