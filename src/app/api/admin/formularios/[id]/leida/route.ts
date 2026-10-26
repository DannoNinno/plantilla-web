import {NextResponse, type NextRequest} from 'next/server';
import {z} from 'zod';
import {crearFormularios} from '@/modules/formularios/crearFormularios';
import {exigirAdminApi} from '@/modules/formularios/admin/proteccion';
import {ErrorPeticion, validarOrigen} from '@/modules/formularios/http';

export async function POST(request: NextRequest, contexto: {params: Promise<{id: string}>}) {
  try {
    validarOrigen(request);
    await exigirAdminApi(request);
    const id = z.uuid().safeParse((await contexto.params).id);
    if (!id.success) throw new ErrorPeticion('Identificador inválido.', 400);
    const {almacen} = await crearFormularios();
    if (!(await almacen.obtener(id.data))) throw new ErrorPeticion('Solicitud no encontrada.', 404);
    await almacen.marcarLeida(id.data);
    return NextResponse.json({ok: true});
  } catch (error) {
    if (error instanceof ErrorPeticion)
      return NextResponse.json({ok: false, mensaje: error.message}, {status: error.estado});
    console.error('Error al marcar una solicitud como leída.', error);
    return NextResponse.json({ok: false, mensaje: 'No se pudo marcar como leída.'}, {status: 503});
  }
}
