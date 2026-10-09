import type {LucideIcon} from 'lucide-react';

export interface AccionHerramientaProps {
  href: string;
  texto: string;
  textoCorto?: string;
  icono: LucideIcon;
  familia: 'marca' | 'plan';
  actual?: boolean;
}

export default function AccionHerramienta({
  href,
  texto,
  textoCorto = texto,
  icono: Icono,
  familia,
  actual = false,
}: AccionHerramientaProps) {
  return (
    <a
      href={href}
      aria-label={texto}
      title={texto}
      aria-current={actual ? 'page' : undefined}
      data-familia={familia}
      className="group flex min-h-12 w-16 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1 text-brand-ink transition-colors duration-150 focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-2 focus-visible:outline-brand-sky-text data-[familia=marca]:bg-brand-coral/10 data-[familia=plan]:bg-brand-sky/10 aria-[current=page]:ring-1 aria-[current=page]:ring-brand-sky-text fine-pointer:data-[familia=marca]:hover:bg-brand-coral/20 fine-pointer:data-[familia=plan]:hover:bg-brand-sky/20 motion-reduce:transition-none sm:w-20"
    >
      <Icono
        size={20}
        aria-hidden="true"
        className="shrink-0 group-data-[familia=marca]:text-brand-coral-dark group-data-[familia=plan]:text-brand-sky-text"
      />
      <span className="max-w-full break-words text-center text-xs font-semibold">{textoCorto}</span>
    </a>
  );
}
