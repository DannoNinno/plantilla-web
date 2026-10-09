import {ArrowUpRight} from 'lucide-react';
import type {EnlaceSocial as EnlaceSocialProps} from './tipos';

export default function EnlaceSocial({texto, href}: EnlaceSocialProps) {
  return (
    <li>
      <a
        href={href}
        className="inline-flex min-h-12 items-center gap-2 rounded-lg px-3 py-2 font-semibold underline underline-offset-4 focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-4 focus-visible:outline-brand-light fine-pointer:hover:text-seccion-suave"
      >
        {texto}
        <ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </li>
  );
}
