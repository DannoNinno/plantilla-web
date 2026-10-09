export interface AvisoDemoProps {
  titulo: string;
  descripcion: string;
}

export default function AvisoDemo({titulo, descripcion}: AvisoDemoProps) {
  return (
    <aside className="border-b border-seccion-tinta/20 bg-seccion-suave px-5 py-4 text-center text-sm text-seccion-tinta">
      <p className="break-words font-bold">{titulo}</p>
      <p className="mt-1 break-words leading-relaxed">{descripcion}</p>
    </aside>
  );
}
