export default function AlcanceCatalogo({condiciones}: {condiciones: string[]}) {
  return (
    <ul className="list-disc space-y-2 pb-6 pl-5 text-sm leading-relaxed text-brand-ink/70">
      {condiciones.map((condicion) => (
        <li key={condicion}>{condicion}</li>
      ))}
    </ul>
  );
}
