import type {ReactNode} from 'react';
import AvisoDemo from '../AvisoDemo/AvisoDemo';
import HerramientasDemo from '../HerramientasDemo/HerramientasDemo';
import type {HerramientasDemoProps} from '../HerramientasDemo/HerramientasDemo';
import MarcoDemo from './MarcoDemo';

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
    <MarcoDemo
      aviso={<AvisoDemo titulo={aviso} descripcion={descripcionAviso} flotante />}
      herramientas={<HerramientasDemo {...herramientas} />}
    >
      {children}
      <p className="mx-auto max-w-3xl break-words px-5 py-8 text-center text-sm leading-relaxed">
        {fase}
      </p>
    </MarcoDemo>
  );
}
