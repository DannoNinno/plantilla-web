export default function SaltoContenido({etiqueta}: {etiqueta: string}) {
  return (
    <a
      href="#contenido"
      className="fixed -top-32 z-salto rounded-lg focus:left-3 focus:top-3 focus:bg-white focus:p-3"
    >
      {etiqueta}
    </a>
  );
}
