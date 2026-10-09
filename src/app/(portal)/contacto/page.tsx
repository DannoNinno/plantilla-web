import PaginaContacto from '@/infrastructure/componentes/Contacto/PaginaContacto';
import {getPaquetes} from '@/infrastructure/handlers/datos';
import {notFound} from 'next/navigation';

export const metadata = {
  title: 'Contacto',
  description: 'Cuéntame qué necesitas o solicita una cotización para tu negocio.',
};

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{paquete?: string | string[]}>;
}) {
  const {paquete} = await searchParams;
  const paquetes = getPaquetes();
  const paqueteInicial = paquetes.find((opcion) => opcion.id === paquete)?.id;
  if (paquete !== undefined && paquete !== 'consulta' && !paqueteInicial) notFound();
  return <PaginaContacto paquetes={paquetes} paqueteInicial={paqueteInicial} />;
}
