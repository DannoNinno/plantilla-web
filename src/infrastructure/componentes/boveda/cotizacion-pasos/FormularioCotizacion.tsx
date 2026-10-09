import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import PasosCotizacion from './PasosCotizacion';
import type {FormularioCotizacionProps} from './tipos';
export default function FormularioCotizacion({
  id,
  titulo,
  descripcion,
  ...formulario
}: FormularioCotizacionProps) {
  return (
    <MarcoSeccion id={id} titulo={titulo} descripcion={descripcion} tono="suave">
      <PasosCotizacion {...formulario} />
    </MarcoSeccion>
  );
}
