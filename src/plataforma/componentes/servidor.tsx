import 'server-only';
import {unstable_noStore as noStore} from 'next/cache';
import {registro} from '@/componentes/registro';
import {sitio} from '@/configuracion/sitio';
import {resolverConfiguracionSitio, validarRegistro} from './seleccion';

export function getRegistro() {
  validarRegistro(registro.map((item) => item.definicion));
  return registro;
}

export function getComponentesActivos() {
  const componentes = getRegistro();
  const seleccion = resolverConfiguracionSitio(
    componentes.map((item) => item.definicion),
    sitio.paquete,
    sitio.componentes,
  );
  for (const error of seleccion.errores) console.error(`[configuracion] ${error}`);
  return {
    componentes: componentes.filter((item) => seleccion.ids.includes(item.definicion.id)),
    errores: seleccion.errores,
  };
}

export async function SeccionesSitio() {
  const {componentes, errores} = getComponentesActivos();
  return (
    <>
      {errores.length > 0 && (
        <p role="alert" className="mx-auto max-w-6xl px-6 py-4 text-brand-coral-dark">
          Algunas secciones no están disponibles. Revisa la configuración en el panel.
        </p>
      )}
      {await Promise.all(
        componentes.map(async (componente) => {
          if (componente.datos) noStore();
          const datos = componente.datos ? await componente.datos() : undefined;
          const Publico = componente.Publico;
          return (
            <section key={componente.definicion.id}>
              <Publico modo="sitio" datos={datos ? await datos.getPublico() : null} />
            </section>
          );
        }),
      )}
    </>
  );
}
