'use client';

import {useSearchParams} from 'next/navigation';
import type {ContactoProps} from '../../../domain/types/ui';
import Contacto from './Contacto';

interface ContactoPlanProps {
  paquetes: ContactoProps['paquetes'];
  planNoDisponible: string;
}

export default function ContactoPlan({paquetes, planNoDisponible}: ContactoPlanProps) {
  const parametros = useSearchParams();
  const solicitado = parametros.get('plan') ?? 'consulta';
  const disponible =
    solicitado === 'consulta' ||
    paquetes.some((paquete) => paquete.habilitado && paquete.id === solicitado);
  const inicial = disponible ? solicitado : 'consulta';

  return (
    <>
      {!disponible && (
        <p role="status" className="mt-6 text-sm text-brand-ink/70">
          {planNoDisponible}
        </p>
      )}
      <Contacto key={inicial} paquetes={paquetes} paqueteInicial={inicial} />
    </>
  );
}
