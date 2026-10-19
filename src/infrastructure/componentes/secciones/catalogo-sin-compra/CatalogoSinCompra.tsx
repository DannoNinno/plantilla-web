import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import TarjetaProducto from './TarjetaProducto';
import type {CatalogoSinCompraProps} from './tipos';
export default function CatalogoSinCompra({
  productos = [],
  textoConsulta,
  hrefConsulta,
  ...cabecera
}: CatalogoSinCompraProps) {
  return (
    <MarcoSeccion {...cabecera}>
      <ul className="grid gap-6 md:grid-cols-2">
        {productos.map((producto) => (
          <TarjetaProducto
            key={producto.id}
            producto={producto}
            textoConsulta={textoConsulta}
            hrefConsulta={hrefConsulta}
          />
        ))}
      </ul>
    </MarcoSeccion>
  );
}
