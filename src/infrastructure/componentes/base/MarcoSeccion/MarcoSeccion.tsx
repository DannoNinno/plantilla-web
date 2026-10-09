import type {ReactNode} from 'react';
import Contenedor from '../Contenedor/Contenedor';
import TituloSeccion from '../TituloSeccion/TituloSeccion';

export interface MarcoSeccionProps {
  id?: string;
  titulo?: string;
  descripcion?: string;
  tono?: 'claro' | 'suave';
  children?: ReactNode;
}

export default function MarcoSeccion({
  id,
  titulo,
  descripcion,
  tono = 'claro',
  children,
}: MarcoSeccionProps) {
  return (
    <section
      id={id}
      data-tono={tono}
      className="scroll-mt-demo-ancla bg-seccion-fondo py-16 text-seccion-tinta data-[tono=suave]:bg-seccion-suave sm:py-24"
    >
      <Contenedor>
        {titulo && <TituloSeccion titulo={titulo} descripcion={descripcion} />}
        {!titulo && descripcion && (
          <p className="max-w-3xl break-words leading-relaxed">{descripcion}</p>
        )}
        <div className="mt-8">{children}</div>
      </Contenedor>
    </section>
  );
}
