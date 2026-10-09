import IndiceBoveda from '@/infrastructure/componentes/demo/IndiceBoveda/IndiceBoveda';
import {registro} from '@/infrastructure/componentes/boveda/registro';
import {negocio} from '@/demo/negocio';
import {getPlanesDemo} from '@/demo/planes';

export const metadata = {
  title: negocio.interfaz.boveda.titulo,
  description: negocio.interfaz.boveda.descripcion,
};

export default function ComponentesPage() {
  return (
    <IndiceBoveda entradas={registro} planes={getPlanesDemo()} textos={negocio.interfaz.boveda} />
  );
}
