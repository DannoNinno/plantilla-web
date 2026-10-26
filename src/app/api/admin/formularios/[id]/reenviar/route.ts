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
    const {almacen, servicio} = await crearFormularios();
    if (!(await almacen.obtener(id.data))) throw new ErrorPeticion('Solicitud no encontrada.', 404);
    const resultado = await servicio.reenviarAviso(id.data);
    if (!resultado.ok) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            resultado.motivo === 'no_disponible'
              ? 'El aviso ya se envió o está reservado. Actualiza el detalle.'
              : 'El aviso falló. Revisa el error registrado en el detalle.',
        },
        {status: resultado.motivo === 'no_disponible' ? 409 : 502},
      );
    }
    return NextResponse.json({ok: true});
  } catch (error) {
    if (error instanceof ErrorPeticion)
      return NextResponse.json({ok: false, mensaje: error.message}, {status: error.estado});
    console.error('Error al reenviar un aviso.', error);
    return NextResponse.json(
      {ok: false, mensaje: 'No se pudo procesar el reenvío.'},
      {status: 503},
    );
  }
}
