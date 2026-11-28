import Entrada from '@/infrastructure/componentes/portal/Entrada/Entrada';
import DatosEstructurados from '@/infrastructure/componentes/portal/Seo/DatosEstructurados';

export const metadata = {title: {absolute: 'Sitios web para pymes | DannoTech'}};

export default function InicioPage() {
  return (
    <>
      <DatosEstructurados />
      <Entrada />
    </>
  );
}
