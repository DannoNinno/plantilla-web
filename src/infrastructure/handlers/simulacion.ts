import {z} from 'zod';
import {compressToEncodedURIComponent, decompressFromEncodedURIComponent} from 'lz-string';
import {registro} from '../componentes/boveda/registro';
import type {CampoEditable} from '../componentes/boveda/Edicion/campos';
import {getComponentes} from './datos';
import {adminConfig} from '../../domain/configuracion/administracion';

const excluidas = new Set(['whatsapp', 'pie-pagina', 'vista-google']);
const fichas = getComponentes();
export const seccionesSimulacion = registro
  .filter(({slug}) => !excluidas.has(slug))
  .map(({slug, nombre, planMinimo, cuentaParaTope}) => {
    const ficha = fichas.find(({id}) => id === slug);
    if (!ficha) throw new Error(`Falta la ficha de la sección ${slug}.`);
    return {
      key: slug,
      nombre: slug === 'portada' ? nombre.toUpperCase() : nombre,
      icono: ficha.icono,
      planMinimo,
      cuentaParaTope,
    };
  });
export type SeccionSimulacion = (typeof seccionesSimulacion)[number];
export const getSeccionSimulacion = (key: string) => seccionesSimulacion.find((s) => s.key === key);
export function seccionesNavegables(keys: readonly string[]) {
  return keys.filter((key) => key !== 'portada');
}
function textoEjemploSimulacion(
  campo: CampoEditable & {tipo: 'texto'},
  seccion: SeccionSimulacion,
) {
  const {ruta} = campo;
  const ultimo = ruta.at(-1);
  const indice = Number(ruta.find((parte) => /^\d+$/.test(parte)) ?? 0) + 1;
  if (
    ruta[0] === 'textos' ||
    (ruta[0] === 'campos' && !ruta.includes('opciones')) ||
    ultimo === 'fecha' ||
    ultimo === 'alt' ||
    ultimo === 'etiquetaDireccion' ||
    ultimo === 'etiquetaHorarios' ||
    ruta[0] === 'enlaces'
  )
    return campo.valor;
  if (ruta.includes('parrafos'))
    return 'Texto de ejemplo para presentar tu negocio, su historia y lo que lo hace diferente.';
  if (ruta.includes('horarios')) return `Horario ${indice}: 09:00 a 18:00`;
  switch (ultimo) {
    case 'titulo':
      return ruta.length === 1
        ? seccion.key === 'portada'
          ? 'Título principal de tu sitio'
          : seccion.nombre
        : `${seccion.key === 'servicios' ? 'Servicio' : 'Noticia'} de ejemplo ${indice}`;
    case 'descripcion':
      return ruta.length === 1
        ? `Contenido de ejemplo para ${seccion.nombre.toLocaleLowerCase('es-CL')}. Aquí irá la información de tu negocio.`
        : 'Descripción de ejemplo. Aquí irá la información de tu negocio.';
    case 'nombre':
      return ruta.includes('personas')
        ? `Integrante ${indice}`
        : ruta.includes('productos')
          ? `Producto ${indice}`
          : ruta.includes('sedes')
            ? `Sede ${indice}`
            : 'DannoTech';
    case 'etiqueta':
      return seccion.key === 'redes-sociales'
        ? 'Redes sociales de ejemplo'
        : 'DannoTech · Sitio de ejemplo';
    case 'texto':
      return ruta.includes('opciones')
        ? `Servicio de ejemplo ${indice}`
        : ruta.includes('accion')
          ? 'Ver más'
          : 'Testimonio de ejemplo sobre la experiencia de un cliente.';
    case 'autor':
      return `Cliente ${indice}`;
    case 'detalle':
      return 'Detalle del testimonio';
    case 'pregunta':
      return `Pregunta frecuente ${indice}`;
    case 'respuesta':
      return 'Respuesta de ejemplo. Aquí puedes aclarar las dudas más comunes de tus clientes.';
    case 'direccion':
      return 'Dirección de ejemplo, ciudad';
    case 'rol':
      return 'Rol en el equipo';
    case 'textoConsulta':
      return 'Consultar por este producto';
    default:
      throw new Error(`Falta definir el texto de muestra para ${seccion.key}: ${ruta.join('.')}.`);
  }
}
export function renderizarSeccionSimulacion(key: string) {
  const seccion = getSeccionSimulacion(key);
  const entrada = registro.find(({slug}) => slug === key);
  if (!seccion || !entrada) return undefined;
  let instancia = entrada.crearInstancia();
  for (const campo of instancia.campos) {
    if (campo.tipo === 'imagen') {
      const logo = campo.ruta[0] === 'logo';
      instancia = instancia.actualizar(campo.ruta, {
        ...campo.valor,
        ...('leyenda' in campo.valor ? {leyenda: 'Imagen de ejemplo'} : {}),
        src: logo
          ? '/dannotech-kit/svg/dannotech-isotipo-fondo-claro.svg'
          : '/simulacion/imagen-ejemplo.svg',
        alt: logo ? 'DannoTech' : 'Imagen de ejemplo',
        width: logo ? 102 : campo.valor.width,
        height: logo ? 88 : campo.valor.height,
      });
    } else if (campo.tipo === 'texto' && campo.ruta.at(-1) !== 'alt') {
      instancia = instancia.actualizar(campo.ruta, textoEjemploSimulacion(campo, seccion));
    }
  }
  return instancia.renderizar();
}
export const MAX_SECCIONES = 6;
const MAX_CODIFICADO = 4096;

export const paginaSimulacionSchema = z
  .object({
    esLanding: z.boolean().default(true),
    navegacion: z.enum(['navbar', 'sidebar', 'ninguna']).default('navbar'),
    fija: z.boolean().default(true),
    transparenteSobreLanding: z.boolean().default(false),
    logo: z
      .enum(['izquierda', 'centro'])
      .default('izquierda')
      .transform(() => 'izquierda' as const),
    menuMovil: z.enum(['hamburguesa', 'drawer']).default('hamburguesa'),
    footer: z.enum(['simple', 'completo', 'ninguno']).default('simple'),
    tema: z
      .enum(['claro', 'oscuro'])
      .default('oscuro')
      .transform(() => 'oscuro' as const),
    ancho: z
      .enum(['completo', 'contenido'])
      .default('completo')
      .transform(() => 'completo' as const),
    scrollSuave: z.boolean().default(true),
    seccionActiva: z.boolean().default(true),
    whatsapp: z.enum(['ninguno', 'abajo-derecha', 'abajo-izquierda']).default('ninguno'),
    volverArriba: z.boolean().default(false),
  })
  .strict();
export const simulacionSchema = z
  .object({
    v: z.literal(1).default(1),
    plan: z.enum(['presencia-digital', 'captacion-clientes']).default('presencia-digital'),
    pagina: paginaSimulacionSchema.default(() => paginaSimulacionSchema.parse({})),
    secciones: z
      .array(
        z
          .string()
          .max(80)
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      )
      .default(['portada']),
  })
  .strict()
  .superRefine((config, contexto) => {
    const error = (mensaje: string) => contexto.addIssue({code: 'custom', message: mensaje});
    if (new Set(config.secciones).size !== config.secciones.length)
      error('No se permiten secciones repetidas.');
    if (config.pagina.esLanding && config.secciones[0] !== 'portada')
      error('En vista landing, PORTADA debe estar en la primera posición.');
    if (config.secciones.some((key) => excluidas.has(key)))
      error(
        'WhatsApp y el pie se configuran como opciones de página; la vista Google no es una sección.',
      );
    if (
      config.plan === 'presencia-digital' &&
      config.secciones.some((key) => getSeccionSimulacion(key)?.planMinimo === 'captacion')
    )
      error(
        'Quita las secciones exclusivas de Captación de Clientes antes de usar Presencia Digital.',
      );
    if (contarSecciones(config.secciones) > MAX_SECCIONES)
      error('El máximo es de seis secciones computables por página, incluida PORTADA.');
  });
export type ConfigSimulacion = z.infer<typeof simulacionSchema>;
export type PaginaSimulacion = ConfigSimulacion['pagina'];
export const valoresPorDefecto = simulacionSchema.parse({});
export type ResultadoSimulacion<T> =
  | {ok: true; valor: T}
  | {
      ok: false;
      error: {codigo: 'formato' | 'limite' | 'configuracion' | 'portapapeles'; mensaje: string};
    };
function fallo(
  codigo: 'formato' | 'limite' | 'configuracion' | 'portapapeles',
  mensaje: string,
): ResultadoSimulacion<never> {
  return {ok: false, error: {codigo, mensaje}};
}
export function contarSecciones(keys: readonly string[]) {
  return keys.filter((key) => getSeccionSimulacion(key)?.cuentaParaTope !== false).length;
}
export function validarSimulacion(config: unknown): ResultadoSimulacion<ConfigSimulacion> {
  const resultado = simulacionSchema.safeParse(config);
  if (resultado.success) return {ok: true, valor: resultado.data};
  const problema = resultado.error.issues[0];
  return fallo(
    'configuracion',
    problema?.code === 'custom'
      ? problema.message
      : `Configuración inválida en ${problema?.path.join('.') || 'el documento'}: usa la versión 1 y las opciones admitidas.`,
  );
}
export function encodeConfig(config: ConfigSimulacion): string {
  return compressToEncodedURIComponent(JSON.stringify(simulacionSchema.parse(config)));
}
export function decodeConfig(c: unknown): ResultadoSimulacion<ConfigSimulacion> {
  if (typeof c !== 'string' || !c || !/^[A-Za-z0-9+$-]+$/.test(c))
    return fallo('formato', 'El enlace no contiene una configuración comprimida válida.');
  if (c.length > MAX_CODIFICADO)
    return fallo('limite', 'La configuración del enlace es demasiado larga.');
  let contenido: unknown;
  try {
    const texto = decompressFromEncodedURIComponent(c);
    if (!texto) return fallo('formato', 'No pude descomprimir la configuración.');
    if (texto.length > 16384)
      return fallo('limite', 'La configuración descomprimida es demasiado larga.');
    contenido = JSON.parse(texto);
  } catch {
    return fallo('formato', 'El enlace no contiene un JSON válido.');
  }
  return validarSimulacion(contenido);
}
export function agregarSeccion(
  config: ConfigSimulacion,
  key: string,
  posicion = config.secciones.length,
) {
  if (config.secciones.includes(key))
    return fallo('configuracion', 'Esa sección ya está en la plantilla.');
  const secciones = [...config.secciones];
  const destino = Math.min(secciones.length, Math.max(config.pagina.esLanding ? 1 : 0, posicion));
  secciones.splice(destino, 0, key);
  return validarSimulacion({...config, secciones});
}
export function quitarSeccion(config: ConfigSimulacion, key: string) {
  if (!config.secciones.includes(key))
    return fallo('configuracion', 'La sección no está en la plantilla.');
  if (config.pagina.esLanding && key === 'portada')
    return fallo('configuracion', 'Desactiva la vista landing para quitar PORTADA.');
  return validarSimulacion({...config, secciones: config.secciones.filter((s) => s !== key)});
}
export function moverSeccion(config: ConfigSimulacion, key: string, posicion: number) {
  if (config.pagina.esLanding && key === 'portada')
    return fallo('configuracion', 'PORTADA está bloqueada al principio de la vista landing.');
  if (!config.secciones.includes(key))
    return fallo('configuracion', 'La sección no está en la plantilla.');
  const secciones = config.secciones.filter((s) => s !== key);
  const destino = Math.min(secciones.length, Math.max(config.pagina.esLanding ? 1 : 0, posicion));
  secciones.splice(destino, 0, key);
  return validarSimulacion({...config, secciones});
}
export function cambiarOpcion(
  config: ConfigSimulacion,
  key: keyof PaginaSimulacion,
  valor: unknown,
) {
  let secciones = config.secciones;
  if (key === 'esLanding' && valor === true)
    secciones = ['portada', ...secciones.filter((s) => s !== 'portada')];
  return validarSimulacion({...config, secciones, pagina: {...config.pagina, [key]: valor}});
}
export function cambiarPlan(config: ConfigSimulacion, plan: string) {
  return validarSimulacion({...config, plan});
}
export const rutaSimulacion = `${adminConfig.rutaPanel}/simulacion/`;
export const rutaEmulacion = `${rutaSimulacion}emular/`;
export function urlSimulacion(config: ConfigSimulacion, emular = false) {
  return `${emular ? rutaEmulacion : rutaSimulacion}?${new URLSearchParams({c: encodeConfig(config)})}`;
}
export function formatoJSON(config: ConfigSimulacion) {
  return JSON.stringify(config, null, 2);
}
export async function copiarJSON(config: ConfigSimulacion): Promise<ResultadoSimulacion<string>> {
  try {
    await navigator.clipboard.writeText(formatoJSON(config));
    return {ok: true, valor: 'Copiado'};
  } catch {
    return fallo(
      'portapapeles',
      'No pude copiar el JSON. Revisa los permisos del portapapeles y usa HTTPS o localhost.',
    );
  }
}
export const opcionesSeleccion = [
  {key: 'navegacion', nombre: 'Navegación', valores: ['navbar', 'sidebar', 'ninguna']},
  {key: 'footer', nombre: 'Pie de página', valores: ['simple', 'completo', 'ninguno']},
  {
    key: 'whatsapp',
    nombre: 'WhatsApp visual',
    valores: ['ninguno', 'abajo-derecha', 'abajo-izquierda'],
  },
] as const;
export const opcionesSwitch = [
  {key: 'esLanding', nombre: 'Vista landing: PORTADA fija al principio'},
  {key: 'fija', nombre: 'Navegación fija'},
  {key: 'transparenteSobreLanding', nombre: 'Navbar transparente sobre PORTADA'},
  {key: 'scrollSuave', nombre: 'Desplazamiento suave'},
  {key: 'seccionActiva', nombre: 'Resaltar sección visible'},
  {key: 'volverArriba', nombre: 'Botón volver arriba'},
] as const;
export const anclaSeccion = (key: string) => `seccion-${key}`;
export function seguirEnlaceEjemplo(href: string, config: ConfigSimulacion) {
  const destino = href.startsWith('#') ? document.getElementById(href.slice(1)) : null;
  const key = destino?.closest('[data-seccion]')?.getAttribute('data-seccion');
  if (key && config.secciones.includes(key)) {
    irASeccion(key, config);
    return '';
  }
  return 'Enlace de ejemplo: el destino no está en esta plantilla. No se abren sitios externos ni se envían mensajes.';
}
export function irASeccion(key: string, config: ConfigSimulacion) {
  const elemento = document.getElementById(anclaSeccion(key));
  if (!elemento) throw new Error(`No existe el anclaje de la sección ${key}.`);
  const compensa =
    config.pagina.fija &&
    (config.pagina.navegacion === 'navbar' ||
      (config.pagina.navegacion === 'sidebar' && window.innerWidth < 1024));
  window.scrollTo({
    top: window.scrollY + elemento.getBoundingClientRect().top - (compensa ? 80 : 0),
    behavior:
      config.pagina.scrollSuave && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'smooth'
        : 'instant',
  });
}
export function volverArriba(config: ConfigSimulacion) {
  window.scrollTo({
    top: 0,
    behavior:
      config.pagina.scrollSuave && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'smooth'
        : 'instant',
  });
}
export interface VistaEmulacion {
  activa: string;
  sobrePortada: boolean;
}
export function observarEmulacion(
  config: ConfigSimulacion,
  actualizar: (vista: VistaEmulacion) => void,
) {
  let activa = config.secciones[0] ?? '';
  const visibles = new Set<string>();
  const publicar = () => {
    const portada = document.getElementById(anclaSeccion('portada'))?.getBoundingClientRect();
    actualizar({
      activa,
      sobrePortada: Boolean(
        config.pagina.esLanding && portada && portada.top <= 80 && portada.bottom > 80,
      ),
    });
  };
  const observador = new IntersectionObserver(
    (entradas) => {
      for (const entrada of entradas) {
        const key = entrada.target.getAttribute('data-seccion');
        if (!key) continue;
        if (entrada.isIntersecting) visibles.add(key);
        else visibles.delete(key);
      }
      activa = config.secciones.find((key) => visibles.has(key)) ?? activa;
      publicar();
    },
    {rootMargin: '-80px 0px -55% 0px'},
  );
  for (const key of config.secciones) {
    const elemento = document.getElementById(anclaSeccion(key));
    if (elemento) observador.observe(elemento);
  }
  window.addEventListener('scroll', publicar, {passive: true});
  publicar();
  return () => {
    observador.disconnect();
    window.removeEventListener('scroll', publicar);
  };
}
