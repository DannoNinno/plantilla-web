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
    nombre: 'onConsulta',
    tipo: '(consulta: ConsultaContacto) => void',
    requerida: false,
    descripcion: 'Recibe una consulta válida. Sin callback, solo muestra un éxito local.',
  },
];
