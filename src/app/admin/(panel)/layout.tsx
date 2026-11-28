import {exigirAdmin} from '@/modules/administracion/proteccion';
import PanelAdmin from '@/infrastructure/componentes/portal/Administracion/PanelAdmin';

export default async function PanelLayout({children}: {children: React.ReactNode}) {
  await exigirAdmin();
  return <PanelAdmin>{children}</PanelAdmin>;
}
