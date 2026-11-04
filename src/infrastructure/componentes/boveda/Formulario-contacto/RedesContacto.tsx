import {Facebook, Instagram, Link, MessageCircle} from 'lucide-react';
import type {RedesContactoProps} from './tipos';

export default function RedesContacto({etiqueta, enlaces}: RedesContactoProps) {
  if (!enlaces.length) return null;
  return (
    <nav aria-label={etiqueta}>
      <ul className="flex flex-wrap gap-3">
        {enlaces.map(({id, texto, href}) => {
          const Icono =
            id === 'instagram'
              ? Instagram
              : id === 'whatsapp'
                ? MessageCircle
                : id === 'facebook'
                  ? Facebook
                  : Link;
          return (
            <li key={id}>
              <a
                href={href}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-current px-3 py-2 font-semibold focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-4 fine-pointer:hover:underline"
              >
                <Icono size={20} aria-hidden="true" className="shrink-0" />
                {texto}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
