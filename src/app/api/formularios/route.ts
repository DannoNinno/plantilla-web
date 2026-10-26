import {NextResponse} from 'next/server';
import {crearFormularios} from '@/modules/formularios/crearFormularios';
import {ErrorPeticion, leerCuerpo, obtenerIp, validarOrigen} from '@/modules/formularios/http';
import type {ResultadoFormulario} from '@/modules/formularios/core/tipos';

export const dynamic = 'force-dynamic';

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
    return NextResponse.json<ResultadoFormulario>(resultado, {
      status: resultado.ok ? 200 : resultado.errores ? 400 : 422,
      headers: {'Cache-Control': 'no-store'},
    });
  } catch (error) {
    if (error instanceof ErrorPeticion) {
      return NextResponse.json<ResultadoFormulario>(
        {ok: false, mensaje: error.message},
        {status: error.estado},
      );
    }
    console.error('Error del endpoint de formularios.', error);
    return NextResponse.json<ResultadoFormulario>(
      {ok: false, mensaje: 'No pudimos guardar tu solicitud. Intenta nuevamente en unos minutos.'},
      {status: 503},
    );
  }
}
