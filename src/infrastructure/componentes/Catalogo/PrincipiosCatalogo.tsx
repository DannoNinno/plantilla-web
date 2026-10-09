import EntradaScroll from '../EntradaScroll/EntradaScroll';

export interface PrincipiosCatalogoProps {
  titulo: string;
  principios: string[];
}

export default function PrincipiosCatalogo({titulo, principios}: PrincipiosCatalogoProps) {
  return (
    <EntradaScroll
      aria-labelledby="principios-titulo"
      className="rounded-2xl border border-brand-ink/10 bg-white p-6 sm:p-8"
    >
      <h2 id="principios-titulo" data-entrada-elemento="titulo" className="text-2xl font-bold">
        {titulo}
      </h2>
      <ul
        data-entrada-elemento="texto"
        className="mt-4 list-disc space-y-3 pl-5 leading-relaxed text-brand-ink/70"
      >
        {principios.map((principio) => (
          <li key={principio}>{principio}</li>
        ))}
      </ul>
    </EntradaScroll>
  );
}
