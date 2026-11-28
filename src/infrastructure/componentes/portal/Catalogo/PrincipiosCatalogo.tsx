export interface PrincipiosCatalogoProps {
  titulo: string;
  principios: string[];
}

export default function PrincipiosCatalogo({titulo, principios}: PrincipiosCatalogoProps) {
  return (
    <div
      aria-labelledby="principios-titulo"
      className="min-w-0 border-t border-brand-ink/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
    >
      <h3 id="principios-titulo" data-entrada-elemento="titulo" className="text-lg font-bold">
        {titulo}
      </h3>
      <ul
        data-entrada-elemento="texto"
        className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-ink/70"
      >
        {principios.map((principio) => (
          <li key={principio}>{principio}</li>
        ))}
      </ul>
    </div>
  );
}
