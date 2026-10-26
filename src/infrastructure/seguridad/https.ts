export function esLocal(url: URL): boolean {
  return ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
}

export function redirigirHTTPS(request: Request): Response | undefined {
  const url = new URL(request.url);
  if (url.protocol !== 'http:' || esLocal(url)) return undefined;
  url.protocol = 'https:';
  return Response.redirect(url.href, ['GET', 'HEAD'].includes(request.method) ? 301 : 308);
}
