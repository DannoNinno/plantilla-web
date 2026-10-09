import type {DocumentacionProp} from '../../boveda/registro';

export interface TablaDocumentacionProps {
  props: DocumentacionProp[];
  titulo: string;
  columnas: string[];
  si: string;
  no: string;
}

export default function TablaProps({props, titulo, columnas, si, no}: TablaDocumentacionProps) {
  return (
    <div className="mt-8 overflow-x-auto rounded-xl border border-brand-ink/20">
      <table className="w-full table-fixed border-collapse text-left text-sm">
        <caption className="p-4 text-left text-lg font-bold">{titulo}</caption>
        <thead className="bg-brand-ink text-white">
          <tr>
            {columnas.map((columna) => (
              <th key={columna} scope="col" className="break-words p-3">
                {columna}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.nombre} className="border-t border-brand-ink/15">
              <th scope="row" className="break-words p-3 align-top">
                {prop.nombre}
              </th>
              <td className="break-words p-3 align-top">{prop.tipo}</td>
              <td className="p-3 align-top">{prop.requerida ? si : no}</td>
              <td className="break-words p-3 align-top">{prop.descripcion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
