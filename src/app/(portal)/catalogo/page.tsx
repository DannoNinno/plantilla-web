import {getCatalogo, getPaquetes, getSitio} from '@/infrastructure/handlers/datos';
import PaginaCatalogo from '@/infrastructure/componentes/Catalogo/PaginaCatalogo';

export const metadata = {title: 'Catálogo'};

export default function CatalogoPage() {
  return <PaginaCatalogo catalogo={getCatalogo()} paquetes={getPaquetes()} sitio={getSitio()} />;
}
