const base =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-3 text-center text-sm font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-brand-sky-text focus-visible:shadow-md fine-pointer:hover:shadow-md motion-safe:focus-visible:-translate-y-0.5 motion-safe:fine-pointer:hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:shadow-none disabled:fine-pointer:hover:transform-none disabled:fine-pointer:hover:shadow-none [&_svg]:shrink-0';

const variantes = {
  seccion:
    'bg-seccion-acento text-white focus-visible:bg-seccion-tinta fine-pointer:hover:bg-seccion-tinta disabled:fine-pointer:hover:bg-seccion-acento',
  coral:
    'bg-brand-coral text-brand-ink focus-visible:bg-brand-coral-dark fine-pointer:hover:bg-brand-coral-dark disabled:fine-pointer:hover:bg-brand-coral',
  sky: 'bg-brand-sky text-brand-ink focus-visible:bg-brand-sky/90 fine-pointer:hover:bg-brand-sky/90 disabled:fine-pointer:hover:bg-brand-sky',
  ink: 'bg-brand-ink text-white focus-visible:bg-brand-catalogo-active fine-pointer:hover:bg-brand-catalogo-active disabled:fine-pointer:hover:bg-brand-ink',
  borde:
    'border border-brand-ink/20 text-brand-ink focus-visible:border-brand-sky-text focus-visible:bg-brand-sky/10 fine-pointer:hover:border-brand-sky-text fine-pointer:hover:bg-brand-sky/10',
  bordeOscuro:
    'border border-white/25 text-white focus-visible:border-brand-sky focus-visible:bg-white/10 fine-pointer:hover:border-brand-sky fine-pointer:hover:bg-white/10',
};

export function clasesBoton(variante: keyof typeof variantes, adicionales = ''): string {
  return [base, variantes[variante], adicionales].filter(Boolean).join(' ');
}
