import type {ButtonHTMLAttributes, ReactNode} from 'react';
import {clasesBoton} from '../../Boton/estilos';

export type BotonProps = {
  children: ReactNode;
  variante?: Parameters<typeof clasesBoton>[0];
} & ({href: string} | ({href?: never} & ButtonHTMLAttributes<HTMLButtonElement>));

export default function Boton({children, variante = 'ink', ...props}: BotonProps) {
  const clases = clasesBoton(variante, 'max-w-full whitespace-normal break-words');
  if (props.href !== undefined) {
    return (
      <a href={props.href} className={clases}>
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
