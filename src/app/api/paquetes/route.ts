import {NextResponse} from 'next/server';
import {getPaquetes} from '@/plataforma/datos/paquetes';

export function GET() {
  return NextResponse.json(getPaquetes());
}
