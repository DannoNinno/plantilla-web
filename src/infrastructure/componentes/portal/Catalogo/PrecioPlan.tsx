import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import {precioDesdeCLP} from '../../../../domain/servicios/precio';

export default function PrecioPlan({
  paquete,
  textos,
  className,
}: {
  paquete: Paquete;
  textos: CatalogoServicios['textos'];
  className?: string;
}) {
  if (!paquete.precioPagoInicial) {
    throw new Error(`Falta el precio por pago inicial del plan: ${paquete.id}`);
  }
  return (
    <div className={className}>
      <p className="text-2xl font-semibold text-brand-sky-text">
        {precioDesdeCLP(paquete.precioDesde)} · {textos.impuestoIncluido}
      </p>
      <p className="mt-1 text-sm text-brand-ink/70">{textos.pagoDosCuotas}</p>
      <p className="mt-3 font-semibold text-brand-sky-text">
        {precioDesdeCLP(paquete.precioPagoInicial)} · {textos.impuestoIncluido}
      </p>
      <p className="mt-1 text-sm text-brand-ink/70">
        {textos.pagoInicial} · {textos.descuentoPagoInicial}
      </p>
    </div>
  );
}
