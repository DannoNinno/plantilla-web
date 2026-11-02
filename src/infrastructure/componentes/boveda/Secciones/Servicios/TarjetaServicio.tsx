import {Check} from 'lucide-react';
import type {Servicio} from './tipos';

export default function TarjetaServicio({titulo, descripcion}: Servicio) {
  return (
    <li className="min-w-0 rounded-2xl border border-seccion-tinta/15 bg-white p-6">
      <Check size={28} aria-hidden="true" className="text-seccion-acento" />
      <h3 className="mt-5 break-words text-xl font-bold">{titulo}</h3>
      {descripcion && <p className="mt-3 break-words leading-relaxed">{descripcion}</p>}
    </li>
  );
}
