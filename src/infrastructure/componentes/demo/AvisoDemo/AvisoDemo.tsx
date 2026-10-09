export interface AvisoDemoProps {
  titulo: string;
  descripcion: string;
  flotante?: boolean;
}

export default function AvisoDemo({titulo, descripcion, flotante = false}: AvisoDemoProps) {
  return (
    <aside
      data-flotante={flotante}
      title={flotante ? descripcion : undefined}
      className="group border-b border-seccion-tinta/20 bg-seccion-suave px-5 py-4 text-center text-sm text-seccion-tinta data-[flotante=true]:max-w-full data-[flotante=true]:rounded-full data-[flotante=true]:border data-[flotante=true]:border-brand-light/15 data-[flotante=true]:bg-brand-ink data-[flotante=true]:px-3 data-[flotante=true]:py-2 data-[flotante=true]:text-xs data-[flotante=true]:text-brand-light data-[flotante=true]:shadow-sm"
    >
      <p className="break-words font-bold group-data-[flotante=true]:truncate">{titulo}</p>
      <p className="mt-1 break-words leading-relaxed group-data-[flotante=true]:sr-only">
        {descripcion}
      </p>
    </aside>
  );
}
