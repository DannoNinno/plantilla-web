import type {Ref} from 'react';
import Contenedor from '../../base/Contenedor/Contenedor';
import Boton from '../../base/Boton/Boton';
import EditorContenido from './EditorContenido';
import SeleccionSecciones from './SeleccionSecciones';
import BandejaContactos from './BandejaContactos';
import type useAdministracion from './useAdministracion';
import type {TextosAdministracion} from '../../../../demo/administracion';
export interface PanelAdministracionProps {
  estado: ReturnType<typeof useAdministracion>;
  textos: TextosAdministracion;
  limite: number;
  tituloRef: Ref<HTMLHeadingElement>;
}
export default function PanelAdministracion({
  estado,
  textos,
  limite,
  tituloRef,
}: PanelAdministracionProps) {
  const google = estado.instancias.find((item) => item.slug === 'vista-google');
  if (!google) throw new Error('Vista previa no disponible.');
  return (
    <section
      id="administracion-demo"
      aria-labelledby="titulo-administracion"
      className="bg-white py-12 text-brand-ink"
    >
      <Contenedor>
        <div className="space-y-8">
          <h2
            ref={tituloRef}
            id="titulo-administracion"
            tabIndex={-1}
            className="break-words text-2xl font-bold sm:text-3xl"
          >
            {textos.titulo}
          </h2>
          <p className="break-words">{textos.aviso}</p>
          {estado.aviso && (
            <p role="status" className="break-words rounded-xl bg-brand-light p-4 font-semibold">
              {estado.aviso}
            </p>
          )}
          <Boton onClick={estado.restablecer} variante="borde">
            {textos.restablecer}
          </Boton>
          <SeleccionSecciones estado={estado} textos={textos} limite={limite} />
          <EditorContenido key={estado.version} estado={estado} textos={textos} />
          {google.renderizar()}
          <BandejaContactos estado={estado} textos={textos} />
        </div>
      </Contenedor>
    </section>
  );
}
