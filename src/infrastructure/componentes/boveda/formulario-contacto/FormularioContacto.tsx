import Contenedor from '../../base/Contenedor/Contenedor';
import TituloSeccion from '../../base/TituloSeccion/TituloSeccion';
import FormularioInteractivo from './FormularioInteractivo';
import type {FormularioContactoProps} from './tipos';

export default function FormularioContacto(props: FormularioContactoProps) {
  const {id, titulo, descripcion, nivelTitulo = 'h2', campos, textos, onConsulta} = props;

  return (
    <section
      id={id}
      className="scroll-mt-demo-ancla bg-seccion-fondo py-16 text-seccion-tinta sm:py-24"
    >
      <Contenedor>
        <div
          data-introduccion={Boolean(titulo || descripcion)}
          className="grid gap-12 data-[introduccion=true]:lg:grid-cols-2 data-[introduccion=false]:mx-auto data-[introduccion=false]:max-w-3xl"
        >
          {(titulo || descripcion) && (
            <div className="min-w-0 space-y-6">
              {titulo && (
                <TituloSeccion titulo={titulo} descripcion={descripcion} nivel={nivelTitulo} />
              )}
              {!titulo && descripcion && <p className="break-words">{descripcion}</p>}
            </div>
          )}
          <FormularioInteractivo campos={campos} textos={textos} onConsulta={onConsulta} />
        </div>
      </Contenedor>
    </section>
  );
}
