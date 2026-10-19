import type {Paquete} from '../../../domain/types/paquete';
import type {CatalogoServicios} from '../../../domain/types/catalogo';

interface ComparacionPlanesProps {
  paquetes: Paquete[];
  textos: CatalogoServicios['comparacion'];
}

export default function ComparacionPlanes({paquetes, textos}: ComparacionPlanesProps) {
  return (
    <section aria-labelledby="comparacion-titulo" className="mt-10">
      <h3 id="comparacion-titulo" className="text-xl font-bold">
        {textos.titulo}
      </h3>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {paquetes.map((paquete) => {
          const datos = paquete.comparacion;
          if (!paquete.habilitado || !datos) {
            throw new Error(`El plan no tiene una comparacion habilitada: ${paquete.id}`);
          }
          return (
            <article
              key={paquete.id}
              className="min-w-0 rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
            >
              <h4 className="text-xl font-bold">{paquete.nombre}</h4>
              <dl className="mt-6 space-y-5 text-sm leading-relaxed">
                <div>
                  <dt className="font-semibold">{textos.secciones}</dt>
                  <dd className="mt-1 text-brand-ink/70">
                    {textos.cantidadSecciones.replace('{cantidad}', String(datos.seccionesMaximas))}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">{textos.panelAdministracion}</dt>
                  <dd className="mt-1 text-brand-ink/70">
                    {datos.panelAdministracion ? textos.panelIncluido : textos.panelNoIncluido}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">{textos.plazoEntrega}</dt>
                  <dd className="mt-1 text-brand-ink/70">{datos.plazoEntrega}</dd>
                </div>
                <div>
                  <dt className="font-semibold">{textos.reuniones}</dt>
                  <dd className="mt-1 text-brand-ink/70">
                    <ul className="list-disc space-y-1 pl-5">
                      {datos.reunionesIncluidas.map((reunion) => (
                        <li key={reunion}>{reunion}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold">{textos.capacitacion}</dt>
                  <dd className="mt-1 text-brand-ink/70">{datos.capacitacion}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </div>
    </section>
  );
}
