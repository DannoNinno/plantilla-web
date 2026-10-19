import type {ReactNode} from 'react';
import type {Paquete} from './paquete';
import type {EnlaceNavegacion} from './sitio';

export interface HeaderProps {
  links?: EnlaceNavegacion[];
}

export interface LoadingModalProps {
  show: boolean;
}

export interface ContactoProps {
  paquetes: Pick<Paquete, 'id' | 'nombre' | 'habilitado'>[];
  paqueteInicial?: string;
  mensajeEtiqueta?: string;
}

export interface LayoutProps {
  children: ReactNode;
}
