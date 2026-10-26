import Link from 'next/link';
import {notFound} from 'next/navigation';
import {z} from 'zod';
import {exigirAdmin} from '@/modules/formularios/admin/proteccion';
import {crearFormularios} from '@/modules/formularios/crearFormularios';
import {formulariosConfig} from '@/config/formularios.config';
import DetalleSolicitud from '@/modules/formularios/admin/DetalleSolicitud';

export default async function SolicitudPage({params}: {params: Promise<{id: string}>}) {
  await exigirAdmin();
  const id = z.uuid().safeParse((await params).id);
  if (!id.success) notFound();
  const {almacen} = await crearFormularios();
  const solicitud = await almacen.obtener(id.data);
  if (!solicitud) notFound();
  return (
    <div className="space-y-6">
      <Link href="/admin/solicitudes/" className="underline">
        Volver a solicitudes
      </Link>
      <DetalleSolicitud solicitud={solicitud} config={formulariosConfig} />
    </div>
  );
}
