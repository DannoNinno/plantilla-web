import {exigirAdmin} from '@/modules/administracion/proteccion';
import EstadoSesion from '@/infrastructure/componentes/portal/Administracion/EstadoSesion';

export default async function EmulacionLayout({children}: {children: React.ReactNode}) {
  await exigirAdmin();
  return (
    <>
      <EstadoSesion />
      {children}
    </>
  );
}
