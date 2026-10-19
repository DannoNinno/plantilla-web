import type {ReactNode} from 'react';
import Link from 'next/link';
import {LockKeyhole} from 'lucide-react';
import type {Paquete} from '../../../domain/types/paquete';
import type {CatalogoServicios} from '../../../domain/types/catalogo';
import {precioDesdeCLP} from '../../../domain/servicios/precio';
import {clasesBoton} from '../Boton/estilos';
import CarruselComparacion from './CarruselComparacion';

interface ComparacionPlanesProps {
  paquetes: Paquete[];
  textos: CatalogoServicios['comparacion'];
}

export default function ComparacionPlanes({paquetes, textos}: ComparacionPlanesProps) {
  for (const paquete of paquetes) {
    if (paquete.habilitado && !paquete.comparacion) {
      throw new Error(`El plan no tiene una comparacion habilitada: ${paquete.id}`);
    }
  }
  const filas: {
    titulo: string;
    contenido: (datos: NonNullable<Paquete['comparacion']>) => ReactNode;
  }[] = [
    {
      titulo: textos.secciones,
      contenido: (datos) =>
        textos.cantidadSecciones.replace('{cantidad}', String(datos.seccionesMaximas)),
    },
    {
      titulo: textos.panelAdministracion,
      contenido: (datos) =>
        datos.panelAdministracion ? textos.panelIncluido : textos.panelNoIncluido,
    },
    {titulo: textos.plazoEntrega, contenido: (datos) => datos.plazoEntrega},
    {
      titulo: textos.reuniones,
      contenido: (datos) => (
        <ul className="list-disc space-y-2 pl-4">
          {datos.reunionesIncluidas.map((reunion) => (
            <li key={reunion}>{reunion}</li>
          ))}
        </ul>
      ),
    },
    {titulo: textos.capacitacion, contenido: (datos) => datos.capacitacion},
  ];

  return (
    <CarruselComparacion textos={textos}>
      <table className="w-full min-w-max table-fixed border-separate border-spacing-0 bg-white text-left text-sm leading-relaxed">
        <caption className="sr-only">{textos.titulo}</caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky left-0 z-10 w-28 break-words border-b border-r border-brand-ink/10 bg-brand-light p-3 text-xs sm:w-44 sm:p-6 sm:text-sm"
            >
              {textos.caracteristica}
            </th>
            {paquetes.map((paquete) => (
              <th
                key={paquete.id}
                scope="col"
                className={`w-44 border-b border-r border-brand-ink/10 p-3 align-top sm:w-72 sm:p-6 ${paquete.habilitado ? 'bg-white' : 'bg-brand-light text-brand-ink/60'}`}
              >
                <h2 className="text-lg font-bold sm:text-xl">{paquete.nombre}</h2>
                {paquete.habilitado ? (
                  <p className="mt-4 font-semibold text-brand-sky-text">
                    {precioDesdeCLP(paquete.precioDesde)}
                  </p>
                ) : (
                  <p className="mt-4 flex items-center gap-2 font-semibold">
                    <LockKeyhole size={18} aria-hidden="true" />
                    {textos.proximamente}
                  </p>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.titulo}>
              <th
                scope="row"
                className="sticky left-0 z-10 break-words border-b border-r border-brand-ink/10 bg-brand-light p-3 align-top text-xs font-semibold sm:p-6 sm:text-sm"
              >
                {fila.titulo}
              </th>
              {paquetes.map((paquete) => (
                <td
                  key={paquete.id}
                  className={`border-b border-r border-brand-ink/10 p-3 align-top sm:p-6 ${paquete.habilitado ? 'text-brand-ink/70' : 'bg-brand-light text-brand-ink/50'}`}
                >
                  {paquete.habilitado && paquete.comparacion
                    ? fila.contenido(paquete.comparacion)
                    : textos.noDisponible}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="sticky left-0 z-10 border-r border-brand-ink/10 bg-brand-light" />
            {paquetes.map((paquete) => (
              <td
                key={paquete.id}
                className={`border-r border-brand-ink/10 p-3 sm:p-6 ${paquete.habilitado ? '' : 'bg-brand-light'}`}
              >
                {paquete.habilitado && (
                  <Link
                    href={`/catalogo/${paquete.id}`}
                    aria-label={`${textos.verPlan}: ${paquete.nombre}`}
                    className={clasesBoton('borde')}
                  >
                    {textos.verPlan}
                  </Link>
                )}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </CarruselComparacion>
  );
}
