import type {ConfiguracionConsulta} from '../types/consulta';

export function avisoConsulta(config: ConfiguracionConsulta) {
  return [
    {
      titulo: 'Responsable de tus datos',
      texto: `${config.responsable}, a través de ${config.negocio}. Contacto: ${config.correoContacto}.`,
    },
    {
      titulo: 'Para qué los uso',
      texto:
        'Solo para responder tu consulta o cotización por el medio que elegiste. No los uso para publicidad, no los vendo ni los comunico para fines ajenos a tu consulta. Intervienen únicamente los proveedores indicados en este aviso.',
    },
    {
      titulo: 'Qué datos recibo',
      texto:
        'Tu nombre, tu teléfono y/o correo, el canal que elegiste, el plan que te interesa y el mensaje que escribas. El correo incluye la fecha y la versión del consentimiento aceptado.',
    },
    {
      titulo: 'Dónde quedan',
      texto: `Tu consulta llega por correo electrónico y se almacena en los servicios de ${config.proveedores}${config.proveedoresFueraDeChile ? ', que pueden tener servidores fuera de Chile' : ''}. Este sitio no guarda las consultas nuevas en bases de datos, archivos, cachés ni logs. La protección antispam utiliza contadores técnicos temporales, sin el contenido de tu consulta.`,
    },
    {
      titulo: 'Por cuánto tiempo',
      texto: `Si no avanzamos con tu consulta, elimino tus datos en un plazo máximo de ${config.mesesConservacion} meses desde el envío. Si te conviertes en cliente, los conservo mientras dure nuestra relación de trabajo y durante los plazos legales que correspondan.`,
    },
    {
      titulo: 'Tus derechos',
      texto: `Puedes pedirme ver qué datos tengo tuyos, corregirlos, eliminarlos u oponerte a su uso, escribiendo a ${config.correoContacto}.`,
    },
    {
      titulo: 'Tu decisión',
      texto: `Entregar tus datos es voluntario. Puedes retirar tu consentimiento escribiendo a ${config.correoContacto}; eso no afecta lo realizado anteriormente. Si prefieres no usar este formulario, puedes contactarme directamente${config.whatsapp.activo ? ' por WhatsApp' : ' por correo'}.`,
    },
    {
      titulo: 'Importante',
      texto:
        'No incluyas datos sensibles ni innecesarios: información de salud, datos bancarios, contraseñas, RUT ni datos de otras personas sin autorización. Solo necesito lo justo para entender tu consulta.',
    },
    {
      titulo: 'Sin compromiso',
      texto:
        'Enviar este formulario no constituye un contrato, reserva ni aceptación de precios. Los valores publicados son referenciales (“desde”). Cualquier trabajo se acuerda por escrito mediante una cotización formal.',
    },
    {
      titulo: 'Respuesta',
      texto: `Intentaré responderte dentro de ${config.plazoRespuesta}. Este plazo es referencial, no una garantía.`,
    },
    {
      titulo: 'Edad',
      texto:
        'Este formulario está dirigido a personas mayores de 18 años, incluidas quienes consultan en representación de un negocio. No solicito tu fecha de nacimiento.',
    },
    {
      titulo: 'Seguridad',
      texto:
        'Tomo medidas razonables, como cuentas protegidas y acceso restringido. Aun así, ningún envío por internet es completamente infalible.',
    },
    {
      titulo: 'Versión de este aviso',
      texto: `${config.aviso.fecha} (${config.aviso.version}). Los cambios posteriores aplican solo a consultas futuras; no alteran lo que aceptaste al enviar.`,
    },
  ];
}
