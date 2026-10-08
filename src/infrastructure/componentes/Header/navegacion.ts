export function esEnlaceActivo(pathname: string, href: string): boolean {
  const ruta = pathname.replace(/\/+$/, '') || '/';
  const destino = href.replace(/\/+$/, '') || '/';
  return ruta === destino || (destino !== '/' && ruta.startsWith(`${destino}/`));
}
