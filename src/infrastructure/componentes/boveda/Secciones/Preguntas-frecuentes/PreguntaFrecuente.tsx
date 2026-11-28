import {ChevronDown} from 'lucide-react';
import type {Pregunta} from './tipos';

export default function PreguntaFrecuente({pregunta, respuesta}: Pregunta) {
  return (
    <li>
      <details className="group rounded-2xl border border-seccion-tinta/15 bg-white p-5">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 break-words font-semibold focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-4 focus-visible:outline-seccion-acento">
          <span className="min-w-0">{pregunta}</span>
          <ChevronDown size={20} aria-hidden="true" className="shrink-0 group-open:rotate-180" />
        </summary>
        <p className="mt-4 break-words leading-relaxed">{respuesta}</p>
      </details>
    </li>
  );
}
