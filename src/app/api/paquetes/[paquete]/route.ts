import {NextResponse} from 'next/server';
import {getPaquete} from '@/plataforma/datos/paquetes';
import {getRegistro} from '@/plataforma/componentes/servidor';

export async function GET(_request: Request, {params}: {params: Promise<{paquete: string}>}) {
  const paquete = getPaquete((await params).paquete);
  if (!paquete) return NextResponse.json({error: 'Paquete no encontrado.'}, {status: 404});
  return NextResponse.json({
    ...paquete,
    componentes: getRegistro()
      .filter((item) => item.definicion.paquetes[paquete.id])
      .map((item) => item.definicion),
  });
}
