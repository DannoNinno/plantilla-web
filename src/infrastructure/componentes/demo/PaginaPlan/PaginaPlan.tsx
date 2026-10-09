import type {ReactNode} from 'react';
import AvisoDemo from '../AvisoDemo/AvisoDemo';
import HerramientasDemo from '../HerramientasDemo/HerramientasDemo';
import type {HerramientasDemoProps} from '../HerramientasDemo/HerramientasDemo';

export interface PaginaPlanProps {
  children?: ReactNode;
  aviso: string;
  descripcionAviso: string;
  fase: string;
  herramientas: HerramientasDemoProps;
}

export default function PaginaPlan({
  children,
  aviso,
  descripcionAviso,
  fase,
  herramientas,
}: PaginaPlanProps) {
  return (
    <div className="flex h-dvh flex-col bg-seccion-fondo text-seccion-tinta">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <AvisoDemo titulo={aviso} descripcion={descripcionAviso} />
        {children}
        <p className="mx-auto max-w-3xl break-words px-5 py-8 text-center text-sm leading-relaxed">
          {fase}
        </p>
      </div>
      <HerramientasDemo {...herramientas} />
    </div>
  );
}
