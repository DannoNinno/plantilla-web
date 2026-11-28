import {permanentRedirect} from 'next/navigation';

// Los componentes se muestran en el detalle de cada plan del catálogo.
export default function ComponentesPage() {
  permanentRedirect('/catalogo/');
}
