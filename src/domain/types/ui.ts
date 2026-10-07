import type {ReactNode} from 'react';
import type {DefinicionComponente} from './componentes';
import type {Paquete} from './paquete';
import type {EnlaceNavegacion} from './sitio';

export interface HeaderProps {
  links?: EnlaceNavegacion[];
}

export interface LoadingModalProps {
  show: boolean;
}

export interface ContactoProps {
  resumen?: string;
  mensajeEtiqueta?: string;
}

export interface ConfiguradorProps {
  paquete: Paquete;
  definiciones: DefinicionComponente[];
  whatsapp: string;
  nombreSitio: string;
}

export interface LayoutProps {
  children: ReactNode;
}
