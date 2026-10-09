import type {EntradaBoveda} from '../../boveda/registro';
import Contenedor from '../../base/Contenedor/Contenedor';
import TituloSeccion from '../../base/TituloSeccion/TituloSeccion';
import MuestraComponente from './MuestraComponente';

export interface TextosBoveda {
  titulo: string;
  descripcion: string;
  ver: string;
  vacio: string;
  incluido: string;
  volver: string;
  props: string;
  columnas: string[];
  si: string;
  no: string;
  informacionTecnica: string;
}

export interface IndiceBovedaProps {
  entradas: readonly EntradaBoveda[];
  textos: TextosBoveda;
}

export default function IndiceBoveda({entradas, textos}: IndiceBovedaProps) {
  return (
    <div className="py-12 sm:py-20">
      <Contenedor>
        <TituloSeccion titulo={textos.titulo} descripcion={textos.descripcion} nivel="h1" />
      </Contenedor>
      <div className="mt-12 space-y-12">
        {entradas.map((entrada) => (
          <MuestraComponente key={entrada.slug} entrada={entrada} textoVer={textos.ver} />
        ))}
        {entradas.length === 0 && (
          <Contenedor>
            <p>{textos.vacio}</p>
          </Contenedor>
        )}
      </div>
    </div>
  );
}
