import type {CatalogoServicios} from '@/domain/types/catalogo';
import type {ElementoVitrina} from '@/domain/types/componentes';
import GrillaComponentes from '../Vitrina/GrillaComponentes';

export interface BloqueComponentesProps {
  componentes: ElementoVitrina[];
  vitrina: CatalogoServicios['vitrina'];
  alcanceInicial: string;
}

export default function BloqueComponentes({
  componentes,
  vitrina,
  alcanceInicial,
}: BloqueComponentesProps) {
  return (
    <section aria-labelledby="componentes-titulo" className="mt-8">
      <h2 id="componentes-titulo" className="text-2xl font-bold">
        {vitrina.tituloDetalle}
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed text-brand-ink/70">
        {vitrina.introduccionDetalle}
      </p>
      <p className="mt-3 font-semibold">{alcanceInicial}</p>
      <GrillaComponentes componentes={componentes} textos={vitrina.etiquetas} />
    </section>
  );
}
