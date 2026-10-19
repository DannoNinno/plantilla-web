import Image from 'next/image';
import type {ImagenGaleria as ImagenGaleriaProps} from './tipos';

export default function ImagenGaleria({src, alt, width, height, leyenda}: ImagenGaleriaProps) {
  return (
    <li className="min-w-0">
      <figure>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="h-auto w-full rounded-2xl"
        />
        {leyenda && (
          <figcaption className="mt-3 break-words text-sm leading-relaxed">{leyenda}</figcaption>
        )}
      </figure>
    </li>
  );
}
