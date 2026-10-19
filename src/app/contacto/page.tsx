import {Suspense} from 'react';
import ContactoPlan from '@/infrastructure/componentes/Contacto/ContactoPlan';
import {getCatalogo, getPaquetesHabilitados} from '@/infrastructure/handlers/datos';

export const metadata = {
  title: 'Contacto',
  description: 'Cuéntame qué necesitas o solicita una cotización para tu negocio.',
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
      <h1 className="text-4xl font-bold">Conversemos sobre tu proyecto</h1>
      <Suspense fallback={<p role="status">{getCatalogo().detalle.contactoCargando}</p>}>
        <ContactoPlan
          paquetes={getPaquetesHabilitados()}
          planNoDisponible={getCatalogo().detalle.planNoDisponible}
        />
      </Suspense>
    </div>
  );
}
