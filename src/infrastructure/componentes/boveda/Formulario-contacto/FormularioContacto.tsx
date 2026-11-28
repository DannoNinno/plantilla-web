import Contenedor from '../Base/Contenedor/Contenedor';
import TituloSeccion from '../Base/TituloSeccion/TituloSeccion';
import FormularioInteractivo from './FormularioInteractivo';
import RedesContacto from './RedesContacto';
import type {FormularioContactoProps} from './tipos';

export default function FormularioContacto(props: FormularioContactoProps) {
  const {id, titulo, descripcion, nivelTitulo = 'h2', campos, textos, onConsulta, redes} = props;
  const tieneIntroduccion = Boolean(titulo || descripcion || redes?.enlaces.length);

  return (
    <section
      id={id}
      className="scroll-mt-boveda-ancla bg-seccion-fondo py-16 text-seccion-tinta sm:py-24"
    >
      <Contenedor>
        <div
          data-introduccion={tieneIntroduccion}
          className="grid gap-12 data-[introduccion=true]:lg:grid-cols-2 data-[introduccion=false]:mx-auto data-[introduccion=false]:max-w-3xl"
        >
          {tieneIntroduccion && (
            <div className="min-w-0 space-y-6">
              {titulo && (
                <TituloSeccion titulo={titulo} descripcion={descripcion} nivel={nivelTitulo} />
              )}
              {!titulo && descripcion && <p className="break-words">{descripcion}</p>}
              {redes && <RedesContacto {...redes} />}
            </div>
          )}
          <FormularioInteractivo campos={campos} textos={textos} onConsulta={onConsulta} />
        </div>
      </Contenedor>
    </section>
  );
}
