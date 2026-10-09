import type {ReactNode} from 'react';

export interface ContenedorProps {
  children: ReactNode;
}

export default function Contenedor({children}: ContenedorProps) {
  return <div className="mx-auto w-full min-w-0 max-w-6xl px-5 sm:px-8">{children}</div>;
}
