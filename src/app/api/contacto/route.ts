import {NextResponse} from 'next/server';
import {validarConsulta} from '@/plataforma/contacto/validacion';
import {guardarConsulta} from '@/plataforma/datos/consultas';
import {consumirLimite} from '@/plataforma/datos/sqlite';
import {getPaquete} from '@/plataforma/datos/paquetes';
import {getRegistro} from '@/plataforma/componentes/servidor';
import {resolverSeleccion} from '@/plataforma/componentes/seleccion';
import {CuerpoDemasiadoGrande, leerCuerpo, origenPermitido} from '@/plataforma/http/cuerpo';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (request.headers.has('origin') && !origenPermitido(request)) {
    return NextResponse.json({error: 'Origen no permitido.'}, {status: 403});
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return NextResponse.json({error: 'Envío no válido.'}, {status: 415});
  }
  let texto: string;
  try {
    texto = new TextDecoder().decode(await leerCuerpo(request, 16000));
  } catch (causa) {
    if (causa instanceof CuerpoDemasiadoGrande)
      return NextResponse.json({error: causa.message}, {status: 413});
    console.error('[contacto] No se pudo leer el envío.', causa);
    return NextResponse.json({error: 'No fue posible leer la consulta.'}, {status: 400});
  }
  let cuerpo: unknown;
  try {
    cuerpo = JSON.parse(texto);
  } catch {
    return NextResponse.json({error: 'La consulta no contiene JSON válido.'}, {status: 400});
  }
  const {consulta, error} = validarConsulta(cuerpo);
  if (!consulta) return NextResponse.json({error}, {status: 400});
  if (consulta.seleccion) {
    const paquete = getPaquete(consulta.seleccion.paquete);
    if (!paquete) return NextResponse.json({error: 'Paquete no encontrado.'}, {status: 400});
    const definiciones = getRegistro().map((item) => item.definicion);
    const bases = definiciones
      .filter((item) => item.paquetes[paquete.id] === 'base')
      .map((item) => item.id);
    const seleccion = resolverSeleccion(definiciones, paquete.id, [
      ...bases,
      ...consulta.seleccion.componentes,
    ]);
    if (seleccion.errores.length)
      return NextResponse.json({error: seleccion.errores.join(' ')}, {status: 400});
    consulta.seleccion.componentes = seleccion.ids;
  }
  try {
    if (
      !consumirLimite('contacto-global', 100, 60 * 60 * 1000) ||
      !consumirLimite(`contacto:${consulta.correo.toLowerCase()}`, 5, 60 * 60 * 1000)
    ) {
      return NextResponse.json(
        {error: 'Se alcanzó el límite de consultas. Intenta más tarde.'},
        {status: 429},
      );
    }
    guardarConsulta(consulta);
    return NextResponse.json({recibida: true}, {status: 201});
  } catch (causa) {
    console.error('[contacto] No se pudo guardar la consulta.', causa);
    return NextResponse.json(
      {error: 'No fue posible guardar la consulta. Intenta más tarde.'},
      {status: 500},
    );
  }
}
