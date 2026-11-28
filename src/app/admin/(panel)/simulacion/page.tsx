import {exigirAdmin} from '@/modules/administracion/proteccion';
import {decodeConfig, valoresPorDefecto} from '@/infrastructure/handlers/simulacion';
import ArmadorSimulacion from '@/infrastructure/componentes/portal/Simulacion/ArmadorSimulacion';
import ErrorSimulacion from '@/infrastructure/componentes/portal/Simulacion/ErrorSimulacion';

export default async function SimulacionPage({
  searchParams,
}: {
  searchParams: Promise<{c?: string | string[]}>;
}) {
  await exigirAdmin();
  const {c} = await searchParams;
  if (c === undefined) return <ArmadorSimulacion inicial={valoresPorDefecto} />;
  const resultado = decodeConfig(c);
  return resultado.ok ? (
    <ArmadorSimulacion key={typeof c === 'string' ? c : ''} inicial={resultado.valor} />
  ) : (
    <ErrorSimulacion mensaje={resultado.error.mensaje} />
  );
}
