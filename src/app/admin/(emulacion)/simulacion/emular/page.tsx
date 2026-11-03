import {exigirAdmin} from '@/modules/administracion/proteccion';
import {decodeConfig} from '@/infrastructure/handlers/simulacion';
import Emulacion from '@/infrastructure/componentes/portal/Simulacion/Emulacion';
import ErrorSimulacion from '@/infrastructure/componentes/portal/Simulacion/ErrorSimulacion';

export default async function EmularPage({
  searchParams,
}: {
  searchParams: Promise<{c?: string | string[]}>;
}) {
  await exigirAdmin();
  const {c} = await searchParams;
  const resultado = decodeConfig(c);
  return resultado.ok ? (
    <Emulacion config={resultado.valor} />
  ) : (
    <ErrorSimulacion mensaje={resultado.error.mensaje} />
  );
}
