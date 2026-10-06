import {NextResponse} from 'next/server';
import {getSesion} from '@/plataforma/auth/sesion';
import {getComponentesActivos} from '@/plataforma/componentes/servidor';
import {ArchivoExcelInvalido, exportarExcel, importarExcel} from '@/plataforma/excel/servicio';
import {CuerpoDemasiadoGrande, leerCuerpo, origenPermitido} from '@/plataforma/http/cuerpo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Contexto = {params: Promise<{id: string}>};

async function getContrato(id: string) {
  const componente = getComponentesActivos().componentes.find((item) => item.definicion.id === id);
  return componente?.datos ? (await componente.datos()).excel : undefined;
}

export async function GET(_request: Request, {params}: Contexto) {
  if (!(await getSesion()))
    return NextResponse.json({error: 'Debes iniciar sesión.'}, {status: 401});
  const id = (await params).id;
  const contrato = await getContrato(id);
  if (!contrato)
    return NextResponse.json(
      {error: 'Este componente no tiene un contrato Excel disponible.'},
      {status: 404},
    );
  try {
    const archivo = await exportarExcel(contrato);
    return new Response(new Uint8Array(archivo), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${id}.xlsx"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (causa) {
    console.error('[excel] No se pudo exportar.', causa);
    return NextResponse.json({error: 'No fue posible exportar el contenido.'}, {status: 500});
  }
}

export async function POST(request: Request, {params}: Contexto) {
  if (!(await getSesion()))
    return NextResponse.json({error: 'Debes iniciar sesión.'}, {status: 401});
  if (!origenPermitido(request))
    return NextResponse.json({error: 'Origen no permitido.'}, {status: 403});
  const id = (await params).id;
  const contrato = await getContrato(id);
  if (!contrato)
    return NextResponse.json(
      {error: 'Este componente no tiene un contrato Excel disponible.'},
      {status: 404},
    );
  try {
    const cuerpo = await leerCuerpo(request, 5 * 1024 * 1024 + 16000);
    let formulario: FormData;
    try {
      formulario = await new Response(cuerpo, {
        headers: {'Content-Type': request.headers.get('content-type') ?? ''},
      }).formData();
    } catch (causa) {
      throw new ArchivoExcelInvalido('El envío debe ser un formulario con un archivo Excel.', {
        cause: causa,
      });
    }
    const archivo = formulario.get('archivo');
    if (
      !(archivo instanceof File) ||
      !archivo.name.toLowerCase().endsWith('.xlsx') ||
      archivo.size > 5 * 1024 * 1024
    ) {
      return NextResponse.json({error: 'Sube un archivo .xlsx de hasta 5 MB.'}, {status: 400});
    }
    const resultado = await importarExcel(id, Buffer.from(await archivo.arrayBuffer()), contrato);
    return NextResponse.json(resultado, {status: resultado.importado ? 200 : 422});
  } catch (causa) {
    console.error('[excel] No se pudo importar.', causa);
    if (causa instanceof CuerpoDemasiadoGrande)
      return NextResponse.json({error: causa.message}, {status: 413});
    if (causa instanceof ArchivoExcelInvalido)
      return NextResponse.json({error: causa.message}, {status: 400});
    return NextResponse.json(
      {error: 'No fue posible importar el Excel. Revisa el servidor.'},
      {status: 500},
    );
  }
}
