import Link from 'next/link';
import type {ReactNode} from 'react';
import type {EntradaBoveda} from '../../boveda/registro';
import type {TextosBoveda} from '../IndiceBoveda/IndiceBoveda';
import AvisoDemo from '../AvisoDemo/AvisoDemo';
import Contenedor from '../../base/Contenedor/Contenedor';
import TituloSeccion from '../../base/TituloSeccion/TituloSeccion';
import Boton from '../../base/Boton/Boton';
import TablaProps from './TablaProps';

export interface FichaComponenteProps {
  entrada: EntradaBoveda;
  plan: string;
  textos: TextosBoveda;
  aviso: string;
  descripcionAviso: string;
  children?: ReactNode;
}

export default function FichaComponente({
  entrada,
  plan,
  textos,
  aviso,
  descripcionAviso,
  children,
}: FichaComponenteProps) {
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
        <p className="mt-6">
          {textos.incluido}: {plan}
        </p>
        <p className="mt-2">{entrada.cuentaParaTope ? textos.cuenta : textos.noCuenta}</p>
        <TablaProps
          props={entrada.props}
          titulo={textos.props}
          columnas={textos.columnas}
          si={textos.si}
          no={textos.no}
        />
        <h2 className="mb-6 mt-12 text-2xl font-bold">{textos.aislado}</h2>
      </Contenedor>
      <AvisoDemo titulo={aviso} descripcion={descripcionAviso} />
      {children}
      <Contenedor>
        <div className="mt-8">
          <Boton href={`/demo/${entrada.planMinimo}`}>{textos.verPagina}</Boton>
        </div>
      </Contenedor>
    </div>
  );
}
