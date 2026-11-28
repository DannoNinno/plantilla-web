import {Quote} from 'lucide-react';
import type {Testimonio} from './tipos';

export default function TarjetaTestimonio({texto, autor, detalle}: Testimonio) {
  return (
    <li className="min-w-0 rounded-2xl border border-seccion-tinta/15 bg-white p-6">
      <figure>
        <Quote size={28} aria-hidden="true" className="text-seccion-acento" />
        <blockquote className="mt-4 break-words text-lg leading-relaxed">
          <p>{texto}</p>
        </blockquote>
        {(autor || detalle) && (
          <figcaption className="mt-6 break-words">
            {autor && <p className="font-bold">{autor}</p>}
            {detalle && <p className="mt-1 text-sm">{detalle}</p>}
          </figcaption>
        )}
      </figure>
    </li>
  );
}
