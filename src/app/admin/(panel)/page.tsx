import {exigirAdmin} from '@/modules/administracion/proteccion';

export default async function AdminPage() {
  await exigirAdmin();
  return <h1 className="sr-only">Inicio de administración</h1>;
}
