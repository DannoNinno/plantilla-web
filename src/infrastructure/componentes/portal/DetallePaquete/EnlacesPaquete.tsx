import Link from 'next/link';
import type {CatalogoServicios} from '@/domain/types/catalogo';

export interface EnlacesPaqueteProps {
  textos: CatalogoServicios['textos'];
  incluyeBase: boolean;
}

export default function EnlacesPaquete({textos, incluyeBase}: EnlacesPaqueteProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-brand-sky-text">
      <Link href="/catalogo#alcance" className="underline underline-offset-4">
        {textos.verAlcance}
      </Link>
      <Link href="/catalogo#adicionales" className="underline underline-offset-4">
        {textos.verAdicionales}
      </Link>
      {incluyeBase && (
        <Link href="/catalogo/landing" className="underline underline-offset-4">
          {textos.verBase}
        </Link>
      )}
    </div>
  );
}
