import {NextResponse, type NextRequest} from 'next/server';
import {z} from 'zod';
import {INACTIVIDAD_SEGUNDOS} from '@/domain/configuracion/administracion';
import {exigirAdminApi} from '@/modules/administracion/proteccion';
import {cookieAdmin, errorAdmin} from '@/modules/administracion/respuestas';
import {ErrorPeticion, leerCuerpo, validarOrigen} from '@/modules/formularios/http';

const actividadSchema = z.object({
  inactividadMs: z
    .number()
    .int()
    .min(0)
    .max(INACTIVIDAD_SEGUNDOS * 1000 - 1),
});

export async function POST(request: NextRequest) {
  try {
    validarOrigen(request);
    const {almacen, id, token} = await exigirAdminApi(request);
    if (!request.headers.get('content-type')?.includes('application/json'))
      throw new ErrorPeticion('Envía la actividad como JSON.', 415);
    const cuerpo = await leerCuerpo(request, 256);
    let datos: unknown;
    try {
      datos = JSON.parse(cuerpo);
    } catch {
      throw new ErrorPeticion('JSON inválido.', 400);
    }
    const actividad = actividadSchema.safeParse(datos);
    if (!actividad.success) throw new ErrorPeticion('Actividad inválida.', 400);
    if (!(await almacen.renovarSesion(id, Date.now(), actividad.data.inactividadMs)))
      throw new ErrorPeticion('La sesión venció.', 401);
    return cookieAdmin(NextResponse.json({ok: true}), token);
  } catch (error) {
    return errorAdmin(error, request);
  }
}
