import Link from 'next/link';
import {z} from 'zod';
import {exigirAdmin} from '@/modules/formularios/admin/proteccion';
import {crearFormularios} from '@/modules/formularios/crearFormularios';
import {formulariosConfig} from '@/config/formularios.config';
import ListaSolicitudes from '@/modules/formularios/admin/ListaSolicitudes';
import {TAMANO_PAGINA} from '@/modules/formularios/adaptadores/D1Almacen';

const filtroSchema = z.object({
  tipo: z.enum(['consulta', 'cotizacion']).optional(),
  estado: z.enum(['pendiente', 'enviado', 'fallido']).optional(),
  pagina: z.coerce.number().int().min(1).max(100000).default(1),
});

export default async function SolicitudesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await exigirAdmin();
  const parametros = await searchParams;
  const validado = filtroSchema.safeParse({
    ...parametros,
    tipo: parametros.tipo || undefined,
    estado: parametros.estado || undefined,
  });
  if (!validado.success)
    return (
      <p>
        Filtros inválidos. <Link href="/admin/solicitudes/">Restablecer filtros</Link>
      </p>
    );
  const filtro = validado.data;
  const {almacen} = await crearFormularios();
  const [solicitudes, total, fallidas] = await Promise.all([
    almacen.listar(filtro),
    almacen.contar(filtro),
    almacen.contar({estado: 'fallido'}),
  ]);
  function enlace(pagina: number) {
    const query = new URLSearchParams({pagina: String(pagina)});
    if (filtro.tipo) query.set('tipo', filtro.tipo);
    if (filtro.estado) query.set('estado', filtro.estado);
    return `/admin/solicitudes/?${query}`;
  }
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Solicitudes</h1>
        <form action="/api/admin/salir/" method="post">
          <button className="underline">Cerrar sesión</button>
        </form>
      </div>
      <p role="status">
        Avisos fallidos: <strong>{fallidas}</strong>. Revisa también los pendientes.
      </p>
      <form className="flex flex-wrap items-end gap-4">
        <label>
          Tipo
          <select name="tipo" defaultValue={filtro.tipo ?? ''} className="ml-2 rounded border p-2">
            <option value="">Todos</option>
            <option value="consulta">Consulta</option>
            <option value="cotizacion">Cotización</option>
          </select>
        </label>
        <label>
          Estado
          <select
            name="estado"
            defaultValue={filtro.estado ?? ''}
            className="ml-2 rounded border p-2"
          >
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="enviado">Enviado</option>
            <option value="fallido">Fallido</option>
          </select>
        </label>
        <button className="rounded border border-brand-ink px-4 py-2">Filtrar</button>
      </form>
      <ListaSolicitudes solicitudes={solicitudes} config={formulariosConfig} />
      <nav aria-label="Páginas de solicitudes" className="flex gap-5">
        {filtro.pagina > 1 && <Link href={enlace(filtro.pagina - 1)}>Anterior</Link>}
        <span>
          Página {filtro.pagina} · {total} solicitudes
        </span>
        {filtro.pagina * TAMANO_PAGINA < total && (
          <Link href={enlace(filtro.pagina + 1)}>Siguiente</Link>
        )}
      </nav>
    </section>
  );
}
