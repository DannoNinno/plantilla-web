import {ArrowUpRight, LogOut} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type {ReactNode} from 'react';
import {rutasAdmin} from '../../../../domain/configuracion/administracion';
import {getSitio} from '../../../handlers/datos';
import LayoutPanel from '../../boveda/PanelAdministracion/LayoutPanel';
import MenuAdmin from './MenuAdmin';
import EstadoSesion from './EstadoSesion';
import {clasesBoton} from '../../boveda/Base/Boton/estilos';

export default function PanelAdmin({children}: {children: ReactNode}) {
  const sitio = getSitio();
  return (
    <LayoutPanel
      nombre={sitio.nombre}
      subtitulo="Administración"
      marca={
        <Image
          src="/dannotech-kit/svg/dannotech-isotipo-fondo-oscuro.svg"
          alt=""
          width={102}
          height={88}
          className="h-auto w-12"
        />
      }
      inicio={rutasAdmin.inicio}
      menu={<MenuAdmin />}
      acciones={
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            title="Volver al sitio"
            className={clasesBoton('bordeOscuro', '!rounded-none')}
          >
            <ArrowUpRight size={18} aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Volver al sitio</span>
          </Link>
          <form action={rutasAdmin.salir} method="post">
            <button
              type="submit"
              title="Cerrar sesión"
              className={clasesBoton('sky', '!rounded-none')}
            >
              <LogOut size={18} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Cerrar sesión</span>
            </button>
          </form>
        </div>
      }
    >
      <EstadoSesion />
      {children}
    </LayoutPanel>
  );
}
