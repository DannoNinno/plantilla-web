import MarcoSeccion from '../../Base/MarcoSeccion/MarcoSeccion';
import ImagenContenido from '../../Base/ImagenContenido/ImagenContenido';
import Boton from '../../Base/Boton/Boton';
import type {PromocionDestacadaProps} from './tipos';
export default function PromocionDestacada({
  imagen,
  accion,
  etiqueta,
  ...cabecera
}: PromocionDestacadaProps) {
  return (
    <MarcoSeccion {...cabecera}>
      <div className="space-y-6">
        {etiqueta && (
          <p className="break-words font-semibold uppercase tracking-wide">{etiqueta}</p>
        )}
        {imagen && <ImagenContenido imagen={imagen} sizes="100vw" />}
        {accion && (
          <Boton href={accion.href} variante="seccion">
            {accion.texto}
          </Boton>
        )}
      </div>
    </MarcoSeccion>
  );
}
