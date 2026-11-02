import {MessageCircle} from 'lucide-react';
import type {WhatsappProps} from './tipos';

export default function Whatsapp({texto, href}: WhatsappProps) {
  return (
    <a
      href={href}
      aria-label={texto}
      title={texto}
      className="fixed bottom-28 right-4 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-canal-whatsapp text-brand-ink shadow-lg transition duration-150 focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-4 focus-visible:outline-brand-ink motion-safe:fine-pointer:hover:scale-105 motion-safe:focus-visible:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <MessageCircle size={24} aria-hidden="true" />
    </a>
  );
}
