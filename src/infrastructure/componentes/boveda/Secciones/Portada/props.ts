export const propsPortada = [
  {nombre: 'titulo', tipo: 'string', requerida: true, descripcion: 'Título de la presentación.'},
  {nombre: 'id', tipo: 'string', requerida: false, descripcion: 'Ancla de la sección.'},
  {nombre: 'etiqueta', tipo: 'string', requerida: false, descripcion: 'Texto previo al título.'},
  {nombre: 'descripcion', tipo: 'string', requerida: false, descripcion: 'Texto de apoyo.'},
  {
    nombre: 'nivelTitulo',
    tipo: "'h1' | 'h2'",
    requerida: false,
    descripcion: 'h1 por defecto; h2 en una ficha aislada.',
  },
  {
    nombre: 'accion',
    tipo: '{texto, href}',
    requerida: false,
    descripcion: 'Enlace opcional. Omitido en la ficha para no apuntar a otra sección.',
  },
  {
    nombre: 'imagen',
    tipo: '{src, alt, width, height}',
    requerida: false,
    descripcion: 'Imagen opcional con dimensiones y alternativa textual.',
  },
  {
    nombre: 'logo',
    tipo: '{src, alt, width, height}',
    requerida: false,
    descripcion: 'Identidad visual opcional, recibida por props.',
  },
];
