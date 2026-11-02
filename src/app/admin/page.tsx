import {exigirAdmin} from '@/modules/formularios/admin/proteccion';

export default async function AdminPage() {
  await exigirAdmin();
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Administración</h1>
      <p>
        Este panel queda reservado para futuras herramientas. Las consultas llegan directamente al
        correo y no se gestionan aquí.
      </p>
      <form action="/api/admin/salir/" method="post">
        <button className="min-h-12 rounded underline">Cerrar sesión</button>
      </form>
    </section>
  );
}
