export interface Proyecto {
  id: string;
  nombre: string;
  contexto: string;
  tecnologias: string[];
  problema: string;
  solucion: string;
  resultado: string;
  enlace?: string;
}

export interface Capacidad {
  id: 'arquitectura' | 'backend' | 'frontend' | 'datos' | 'infraestructura' | 'herramientas';
  nombre: string;
  enfoque: string;
  tecnologias: string[];
  contexto: string;
}

export interface Experiencia {
  empresa: string;
  cargo: string;
  periodo: string;
  actual: boolean;
  descripcion: string;
  aportes: string[];
}

export interface Perfil {
  nombre: string;
  cargo: string;
  especialidad: string;
  presentacion: string;
  principio: string;
  correo: string;
  experiencia: Experiencia[];
  capacidades: Capacidad[];
  competencias: string[];
  formacion: {titulo: string; institucion: string; periodo: string};
  idiomas: {nombre: string; nivel: string; certificacion: string}[];
  proyectos: Proyecto[];
}

export const perfil: Perfil = {
  nombre: 'Daniel Salamanca Jorquera',
  cargo: 'Desarrollador Full Stack',
  especialidad: 'Arquitectura e integraciones',
  presentacion:
    'Considero el sistema completo y sus dependencias, no solo el componente aislado. Trabajo en integración y arquitectura con una prioridad: construir soluciones mantenibles y sostenibles en el tiempo.',
  principio: 'Siempre hay espacio para especializarme y crecer.',
  correo: 'daniel.progra.work@gmail.com',
  competencias: [
    'Visión arquitectónica',
    'Liderazgo en momentos críticos',
    'Trabajo bajo presión',
    'Mantenibilidad y calidad',
  ],
  capacidades: [
    {
      id: 'arquitectura',
      nombre: 'Arquitectura',
      enfoque: 'Mi foco profesional',
      tecnologias: ['Integraciones', 'Estándares técnicos', 'Visión de sistemas'],
      contexto:
        'Arquitectura de integraciones con proveedores externos y rediseño del sistema de Ensayos PAES en Santo Tomás.',
    },
    {
      id: 'backend',
      nombre: 'Backend',
      enfoque: 'Servicios e integración',
      tecnologias: ['Node.js', 'Express', 'Python', 'C# / ASP.NET', 'API REST'],
      contexto:
        'Rol de Backend e Integraciones en Santo Tomás. Desarrollo de un asistente conversacional con IA en C# y Python en TREBOL-IT.',
    },
    {
      id: 'frontend',
      nombre: 'Frontend',
      enfoque: 'Interfaces web',
      tecnologias: ['Angular', 'Next.js', 'HTML', 'CSS / Tailwind', 'JavaScript', 'TypeScript'],
      contexto: 'Conocimientos de desarrollo web incluidos en mi perfil Full Stack.',
    },
    {
      id: 'datos',
      nombre: 'Bases de datos',
      enfoque: 'Relacionales y NoSQL',
      tecnologias: ['MySQL', 'MongoDB', 'Oracle', 'PostgreSQL'],
      contexto: 'Conocimientos en motores relacionales y documentales declarados en mi currículum.',
    },
    {
      id: 'infraestructura',
      nombre: 'Infraestructura',
      enfoque: 'Entornos y despliegues',
      tecnologias: ['Docker', 'Kubernetes / Rancher'],
      contexto:
        'Conocimientos de contenedores y orquestación. Validación de despliegues en QA y producción en Santo Tomás.',
    },
    {
      id: 'herramientas',
      nombre: 'Innovación',
      enfoque: 'Herramientas complementarias',
      tecnologias: ['Unity', 'Prompting de IA'],
      contexto:
        'Experiencia en proyectos de innovación, videojuegos educativos y MVPs en TREBOL-IT.',
    },
  ],
  experiencia: [
    {
      empresa: 'Santo Tomás',
      cargo: 'Backend · Integraciones',
      periodo: 'Ene 2025 — Actualidad',
      actual: true,
      descripcion:
        'Responsable de la arquitectura de integraciones con proveedores externos, definiendo estándares técnicos y validando despliegues en QA y producción.',
      aportes: [
        'Rediseño en solitario del sistema de Ensayos PAES frente a fallas estructurales recurrentes.',
        'Solución estable con una vida útil proyectada de más de cinco años.',
      ],
    },
    {
      empresa: 'TREBOL-IT',
      cargo: 'Desarrollador en Innovación',
      periodo: 'Nov 2022 — Dic 2024',
      actual: false,
      descripcion:
        'Diseño de soluciones técnicas para migraciones y proyectos de innovación: videojuegos educativos, MVPs y mejoras en producción.',
      aportes: [
        'Liderazgo de equipos en momentos críticos, priorizando mantenibilidad y calidad.',
        'Desarrollo de un asistente conversacional en tiempo real con IA, utilizando C# y Python.',
      ],
    },
  ],
  formacion: {
    titulo: 'Analista Programador · Titulado',
    institucion: 'Instituto INACAP',
    periodo: '2020 — 2022',
  },
  idiomas: [{nombre: 'Inglés', nivel: 'Avanzado', certificacion: 'Certificado KOE Avanzado'}],
  proyectos: [
    {
      id: 'ensayos-paes',
      nombre: 'Rediseño de Ensayos PAES',
      contexto: 'Santo Tomás · Arquitectura e integraciones',
      tecnologias: ['Arquitectura', 'Integraciones', 'QA / Producción'],
      problema:
        'Fallas estructurales recurrentes en el sistema entregado por proveedores externos.',
      solucion: 'Rediseñé el sistema en solitario para resolver los problemas de su estructura.',
      resultado: 'Una solución estable, con una vida útil proyectada de más de cinco años.',
    },
    {
      id: 'asistente-ia',
      nombre: 'Asistente conversacional con IA',
      contexto: 'TREBOL-IT · Innovación',
      tecnologias: ['C#', 'Python', 'IA', 'Tiempo real'],
      problema:
        'Un proyecto de innovación requería una integración conversacional con IA en tiempo real.',
      solucion: 'Desarrollé la integración del asistente utilizando C# y Python.',
      resultado:
        'Un asistente conversacional en tiempo real como parte de los proyectos de innovación.',
    },
  ],
};
