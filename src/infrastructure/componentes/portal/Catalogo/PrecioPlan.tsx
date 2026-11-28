import type {Paquete} from '@/domain/types/paquete';
import type {CatalogoServicios} from '@/domain/types/catalogo';
import {cuotaCLP, precioDesdeCLP} from '../../../../domain/servicios/precio';

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
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-ink/70">
        {textos.pagoInicial} · {textos.descuentoPagoInicial}
      </p>
      <p className="mt-1 text-3xl font-bold text-brand-coral-dark">
        {precioDesdeCLP(paquete.precioPagoInicial)}
      </p>
      <p className="mt-3 font-semibold">
        {textos.pagoDosCuotas.replace('{monto}', cuotaCLP(paquete.precioDesde, 2))}
      </p>
      <p className="mt-2 text-xs text-brand-ink/70">{textos.impuestoIncluido}</p>
    </div>
  );
}
