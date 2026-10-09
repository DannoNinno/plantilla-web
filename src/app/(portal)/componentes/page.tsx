import IndiceBoveda from '@/infrastructure/componentes/demo/IndiceBoveda/IndiceBoveda';
import {registroBoveda} from '@/infrastructure/componentes/boveda/registro';
import {negocio} from '@/demo/negocio';

export const metadata = {
  title: negocio.interfaz.boveda.titulo,
  description: negocio.interfaz.boveda.descripcion,
};

export default function ComponentesPage() {
  return <IndiceBoveda entradas={registroBoveda} textos={negocio.interfaz.boveda} />;
}
