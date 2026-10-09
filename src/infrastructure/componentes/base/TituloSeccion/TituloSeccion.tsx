export interface TituloSeccionProps {
  titulo: string;
  descripcion?: string;
  etiqueta?: string;
  nivel?: 'h1' | 'h2';
}

export default function TituloSeccion({
  titulo,
  descripcion,
  etiqueta,
  nivel: Titulo = 'h2',
}: TituloSeccionProps) {
  return (
    <div className="max-w-3xl space-y-4 break-words">
      {etiqueta && <p className="text-sm font-semibold uppercase tracking-wide">{etiqueta}</p>}
      <Titulo className="font-editorial text-3xl font-bold leading-tight sm:text-5xl">
        {titulo}
      </Titulo>
      {descripcion && <p className="text-base leading-relaxed sm:text-lg">{descripcion}</p>}
    </div>
  );
}
