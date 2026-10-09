import Contacto from '@/infrastructure/componentes/Contacto/Contacto';
import {getPaquetes} from '@/infrastructure/handlers/datos';

export const metadata = {
  title: 'Contacto',
  description: 'Cuéntame qué necesitas o solicita una cotización para tu negocio.',
};

export default function ContactoPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 sm:py-20">
      <h1 className="text-4xl font-bold">Conversemos sobre tu proyecto</h1>
      <Contacto paquetes={getPaquetes()} />
    </div>
  );
}
