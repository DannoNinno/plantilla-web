'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {House, PanelsTopLeft} from 'lucide-react';
import {rutaSimulacion} from '@/infrastructure/handlers/simulacion';
import {adminConfig, rutasAdmin} from '../../../../domain/configuracion/administracion';

export default function MenuAdmin() {
  const ruta = usePathname().replace(/\/$/, '');
  const opciones = [
    {
      href: rutasAdmin.inicio,
      nombre: 'Inicio',
      Icono: House,
      activo: ruta === adminConfig.rutaPanel,
    },
    {
      href: rutaSimulacion,
      nombre: 'Simulación',
      Icono: PanelsTopLeft,
      activo: ruta === rutaSimulacion.slice(0, -1) || ruta.startsWith(rutaSimulacion),
    },
  ];
  return (
    <>
      {opciones.map(({href, nombre, Icono, activo}) => (
        <Link
          key={href}
          href={href}
          aria-current={activo ? 'page' : undefined}
          className={`flex min-h-12 items-center gap-3 border-l-4 px-3 py-3 text-sm font-semibold focus-visible:outline-brand-sky ${activo ? 'border-brand-coral bg-brand-sky text-brand-ink' : 'border-transparent text-brand-light hover:bg-brand-sky/15'}`}
        >
          <Icono size={18} aria-hidden="true" /> {nombre}
        </Link>
      ))}
    </>
  );
}
