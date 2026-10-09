'use client';

import type {ReactNode} from 'react';
import useEnfoqueDemo from './useEnfoqueDemo';

export interface MarcoDemoProps {
  children?: ReactNode;
  aviso: ReactNode;
  herramientas: ReactNode;
}

export default function MarcoDemo({children, aviso, herramientas}: MarcoDemoProps) {
  const {superior, inferior, enfocar} = useEnfoqueDemo();
  return (
    <div className="fixed inset-0 h-dvh bg-seccion-fondo text-seccion-tinta">
      <div className="h-full overflow-y-auto pt-16 pb-28" onFocusCapture={enfocar}>
        {children}
      </div>
      <div
        ref={superior}
        className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center px-3 py-2"
      >
        <div className="pointer-events-auto max-w-full">{aviso}</div>
      </div>
      <div ref={inferior} className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        {herramientas}
      </div>
    </div>
  );
}
