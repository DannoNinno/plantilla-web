import Link from 'next/link';
import type {ReactNode} from 'react';
import type {EntradaBoveda} from '../../boveda/registro';
import type {TextosBoveda} from '../IndiceBoveda/IndiceBoveda';
import Contenedor from '../../base/Contenedor/Contenedor';
import TituloSeccion from '../../base/TituloSeccion/TituloSeccion';
import TablaProps from './TablaProps';

export interface FichaComponenteProps {
  entrada: EntradaBoveda;
  plan: string;
  textos: TextosBoveda;
  children?: ReactNode;
}

export default function FichaComponente({entrada, plan, textos, children}: FichaComponenteProps) {
  return (
    <div className="py-12 sm:py-20">
      <Contenedor>
        <Link
          href="/componentes"
          className="inline-flex min-h-12 items-center underline underline-offset-4"
        >
          {textos.volver}
        </Link>
        <TituloSeccion titulo={entrada.nombre} descripcion={entrada.descripcionCorta} nivel="h1" />
      </Contenedor>
      <div className="mt-8">{children}</div>
      <Contenedor>
        <details className="mt-8 rounded-xl border border-brand-ink/15 p-5">
          <summary className="cursor-pointer font-semibold">{textos.informacionTecnica}</summary>
          <p className="mt-6">
            {textos.incluido}: {plan}
          </p>
          <TablaProps
            props={entrada.props}
            titulo={textos.props}
            columnas={textos.columnas}
            si={textos.si}
            no={textos.no}
          />
        </details>
      </Contenedor>
    </div>
  );
}
