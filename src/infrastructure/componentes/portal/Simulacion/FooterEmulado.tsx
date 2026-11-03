import type {PaginaSimulacion} from '@/infrastructure/handlers/simulacion';
import LogoSimulacion from './LogoSimulacion';

export default function FooterEmulado({pagina}: {pagina: PaginaSimulacion}) {
  if (pagina.footer === 'ninguno') return null;
  return (
    <footer
      data-testid="footer-emulado"
      className="border-t border-brand-sky/40 bg-brand-ink px-6 py-8 text-brand-light"
    >
      <div className="mx-auto max-w-6xl">
        {pagina.footer === 'completo' ? (
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <LogoSimulacion oscuro />
              <p>Sitio de ejemplo</p>
            </div>
            <div className="space-y-3">
              <h2 className="font-bold">Contacto de ejemplo</h2>
              <p>Correo del negocio</p>
              <p>Teléfono y dirección</p>
            </div>
            <div className="space-y-3">
              <h2 className="font-bold">Redes de ejemplo</h2>
              <p>Instagram · Facebook · LinkedIn</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-sm">Sitio de ejemplo · Emulación de estructura</p>
        )}
      </div>
    </footer>
  );
}
