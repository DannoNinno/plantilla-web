export const propsFormularioContacto = [
  {
    nombre: 'campos',
    tipo: 'Record<nombre | correo | mensaje, CampoContactoProps>',
    requerida: true,
    descripcion: 'Etiquetas, errores y placeholders opcionales de los campos.',
  },
  {
    nombre: 'textos',
    tipo: '{enviar, aviso, exito, reiniciar, errorGeneral, limite, sinJavascript}',
    requerida: true,
    descripcion: 'Todos los mensajes del formulario, incluidos los errores y el resultado.',
  },
  {nombre: 'id', tipo: 'string', requerida: false, descripcion: 'Ancla de la sección.'},
  {nombre: 'titulo', tipo: 'string', requerida: false, descripcion: 'Título opcional.'},
  {
    nombre: 'descripcion',
    tipo: 'string',
    requerida: false,
    descripcion: 'Texto introductorio opcional.',
  },
  {nombre: 'nivelTitulo', tipo: "'h1' | 'h2'", requerida: false, descripcion: 'h2 por defecto.'},
  {
    nombre: 'redes',
    tipo: '{etiqueta: string, enlaces: readonly {id, texto, href}[]}',
    requerida: false,
    descripcion:
      'Redes integradas en el contacto. Usa id instagram, whatsapp o facebook para su icono Lucide; otros IDs usan un icono de enlace. Sin enlaces no se muestra navegación.',
  },
  {
    nombre: 'onConsulta',
    tipo: '(consulta: ConsultaContacto) => void',
    requerida: false,
    descripcion: 'Recibe una consulta válida. Sin callback, solo muestra un éxito local.',
  },
];
