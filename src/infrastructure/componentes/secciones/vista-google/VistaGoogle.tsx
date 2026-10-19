import {Search} from 'lucide-react';
import type {VistaGoogleProps} from './tipos';
export default function VistaGoogle({etiqueta, url, titulo, descripcion, nota}: VistaGoogleProps) {
  return (
    <aside
      aria-label={etiqueta}
      className="min-w-0 rounded-2xl border border-brand-ink/15 bg-white p-5"
    >
      <p className="flex items-center gap-2 font-semibold">
        <Search size={20} aria-hidden="true" />
        {etiqueta}
      </p>
      <article className="mt-6 min-w-0">
        <p className="break-words text-sm">{url}</p>
        <h3 className="mt-2 break-words text-xl font-semibold text-brand-sky-text">{titulo}</h3>
        <p className="mt-2 break-words leading-relaxed">{descripcion}</p>
      </article>
      <p className="mt-5 break-words text-sm">{nota}</p>
    </aside>
  );
}
