import Image from 'next/image';
import MarcoSeccion from '../../base/MarcoSeccion/MarcoSeccion';
import type {QuienesSomosProps} from './tipos';

export default function QuienesSomos({parrafos = [], imagen, ...cabecera}: QuienesSomosProps) {
  return (
    <MarcoSeccion {...cabecera}>
      <div
        data-imagen={Boolean(imagen)}
        className="grid items-center gap-10 data-[imagen=true]:lg:grid-cols-2"
      >
        <div className="min-w-0 space-y-5">
          {parrafos.map((parrafo, indice) => (
            <p key={indice} className="break-words text-lg leading-relaxed">
              {parrafo}
            </p>
          ))}
        </div>
        {imagen && (
          <Image
            {...imagen}
            alt={imagen.alt}
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="h-auto w-full rounded-3xl"
          />
        )}
      </div>
    </MarcoSeccion>
  );
}
