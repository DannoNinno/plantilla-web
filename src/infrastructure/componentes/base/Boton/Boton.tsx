import type {AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode} from 'react';
import {clasesBoton} from '../../Boton/estilos';

export type BotonProps = {
  children: ReactNode;
  variante?: Parameters<typeof clasesBoton>[0];
} & (
  | ({href: string} & AnchorHTMLAttributes<HTMLAnchorElement>)
  | ({href?: never} & ButtonHTMLAttributes<HTMLButtonElement>)
);

export default function Boton({children, variante = 'ink', ...props}: BotonProps) {
  const clases = clasesBoton(
    variante,
    'max-w-full whitespace-normal break-words focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-4',
  );
  if (props.href !== undefined) {
    return (
      <a {...props} className={clases}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" {...props} className={clases}>
      {children}
    </button>
  );
}
