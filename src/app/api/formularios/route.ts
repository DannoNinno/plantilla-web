import {NextResponse} from 'next/server';
import {crearFormularios, obtenerEntorno} from '@/modules/formularios/crearFormularios';
import {ErrorPeticion, leerCuerpo, obtenerIp, validarOrigen} from '@/modules/formularios/http';
import type {ResultadoConsulta} from '@/domain/types/consulta';
import {crearToken} from '@/modules/formularios/core/tokenConsulta';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const env = await obtenerEntorno();
    const token = await crearToken(env.IP_SALT ?? '');
    return NextResponse.json({token}, {headers: {'Cache-Control': 'no-store'}});
  } catch {
    console.error('No se pudo preparar el formulario de consulta.');
    return NextResponse.json(
      {mensaje: 'No pude preparar el formulario. Inténtalo nuevamente.'},
      {status: 503, headers: {'Cache-Control': 'no-store'}},
    );
  }
}

export async function POST(request: Request) {
  try {
    validarOrigen(request);
    if (!request.headers.get('content-type')?.startsWith('application/json')) {
      throw new ErrorPeticion('Envía los datos como JSON.', 415);
    }
    const texto = await leerCuerpo(request);
    let datos: unknown;
    try {
      datos = JSON.parse(texto);
    } catch {
      throw new ErrorPeticion('Los datos no tienen un formato válido.', 400);
    }
    const {servicio} = await crearFormularios();
    const resultado = await servicio.procesar(datos, obtenerIp(request));
    return NextResponse.json<ResultadoConsulta>(resultado, {
      status: resultado.ok ? 200 : resultado.errores ? 400 : 422,
      headers: {'Cache-Control': 'no-store'},
    });
  } catch (error) {
    if (error instanceof ErrorPeticion) {
      return NextResponse.json<ResultadoConsulta>(
        {ok: false, mensaje: error.message},
        {status: error.estado, headers: {'Cache-Control': 'no-store'}},
      );
    }
    console.error('consulta fallida: configuración o infraestructura');
    return NextResponse.json<ResultadoConsulta>(
      {
        ok: false,
        mensaje: 'No pude enviar tu consulta. Inténtalo de nuevo o utiliza el correo de contacto.',
      },
      {status: 503, headers: {'Cache-Control': 'no-store'}},
    );
  }
}
