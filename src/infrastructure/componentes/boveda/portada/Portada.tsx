import Image from 'next/image';
import Boton from '../../base/Boton/Boton';
import Contenedor from '../../base/Contenedor/Contenedor';
import TituloSeccion from '../../base/TituloSeccion/TituloSeccion';
import type {PortadaProps} from './tipos';

export default function Portada({
  titulo,
  id,
  etiqueta,
  descripcion,
  nivelTitulo = 'h1',
  accion,
  imagen,
}: PortadaProps) {
  return (
    <section id={id} className="bg-seccion-fondo py-16 text-seccion-tinta sm:py-24">
      <Contenedor>
        <div className="grid min-h-demo-portada items-center gap-12 lg:grid-cols-2">
          <div className="min-w-0 space-y-8">
            <TituloSeccion
              titulo={titulo}
              descripcion={descripcion}
              etiqueta={etiqueta}
              nivel={nivelTitulo}
            />
            {accion && <Boton href={accion.href}>{accion.texto}</Boton>}
          </div>
          {imagen && (
            <Image
              src={imagen.src}
              alt={imagen.alt}
              width={imagen.width}
              height={imagen.height}
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="h-auto w-full rounded-3xl"
            />
          )}
        </div>
      </Contenedor>
    </section>
  );
}
