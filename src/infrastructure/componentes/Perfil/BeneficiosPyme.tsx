import {useId} from 'react';
import type {Perfil} from '../../../domain/types/perfil';

export default function BeneficiosPyme({contenido}: {contenido: Perfil['beneficiosPyme']}) {
  const tituloId = useId();
  return (
    <section
      aria-labelledby={tituloId}
      className="mt-6 rounded-xl border border-white/15 bg-white/5 p-5"
    >
      <h2 id={tituloId} className="text-lg font-bold">
        {contenido.titulo}
      </h2>
      <ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-relaxed text-white/80">
        {contenido.puntos.map((punto) => (
          <li key={punto.texto}>{punto.texto}</li>
        ))}
      </ul>
    </section>
  );
}
