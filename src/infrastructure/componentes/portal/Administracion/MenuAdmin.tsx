'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {House} from 'lucide-react';
import {adminConfig, rutasAdmin} from '../../../../domain/configuracion/administracion';

export default function MenuAdmin() {
  const activo = usePathname().replace(/\/$/, '') === adminConfig.rutaPanel;
  return (
    <Link
      href={rutasAdmin.inicio}
      aria-current={activo ? 'page' : undefined}
      className={`flex min-h-12 items-center gap-3 border-l-4 px-3 py-3 text-sm font-semibold focus-visible:outline-brand-sky ${activo ? 'border-brand-coral bg-brand-sky text-brand-ink' : 'border-transparent text-brand-light hover:bg-brand-sky/15'}`}
    >
      <House size={18} aria-hidden="true" /> Inicio
    </Link>
  );
}
