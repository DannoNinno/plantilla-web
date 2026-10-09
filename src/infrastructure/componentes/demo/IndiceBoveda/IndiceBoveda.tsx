import type {EntradaBoveda} from '../../boveda/registro';
import type {PlanDemo} from '../../../../demo/planes';
import Boton from '../../base/Boton/Boton';
import Contenedor from '../../base/Contenedor/Contenedor';
import TituloSeccion from '../../base/TituloSeccion/TituloSeccion';
import TarjetaComponente from './TarjetaComponente';

export interface TextosBoveda {
  titulo: string;
  descripcion: string;
  ver: string;
  demo: string;
  vacio: string;
  incluido: string;
  cuenta: string;
  noCuenta: string;
  volver: string;
  props: string;
  columnas: string[];
  si: string;
  no: string;
  aislado: string;
  verPagina: string;
}

export interface IndiceBovedaProps {
  entradas: readonly EntradaBoveda[];
  planes: PlanDemo[];
  textos: TextosBoveda;
}

export default function IndiceBoveda({entradas, planes, textos}: IndiceBovedaProps) {
  return (
    <div className="py-12 sm:py-20">
      <Contenedor>
        <TituloSeccion titulo={textos.titulo} descripcion={textos.descripcion} nivel="h1" />
        <div className="mt-12 space-y-12">
          {planes.map((plan) => (
            <section key={plan.id} aria-labelledby={`plan-${plan.id}`}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 id={`plan-${plan.id}`} className="break-words text-2xl font-bold">
                  {plan.nombre}
                </h2>
                <Boton href={plan.href}>{textos.demo}</Boton>
              </div>
              <p className="mt-3 max-w-3xl break-words leading-relaxed">{plan.descripcion}</p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {entradas
                  .filter((entrada) => entrada.planMinimo === plan.id)
                  .map((entrada) => (
                    <TarjetaComponente
                      key={entrada.slug}
                      entrada={entrada}
                      plan={plan.nombre}
                      textoVer={textos.ver}
                      textoCuenta={entrada.cuentaParaTope ? textos.cuenta : textos.noCuenta}
                    />
                  ))}
              </div>
              {!entradas.some((entrada) => entrada.planMinimo === plan.id) && (
                <p className="mt-6 rounded-xl bg-white p-6">{textos.vacio}</p>
              )}
            </section>
          ))}
        </div>
      </Contenedor>
    </div>
  );
}
