import {useId} from 'react';
import {registro} from '../../boveda/registro';
import CampoEditor from './CampoEditor';
import type useAdministracion from './useAdministracion';
import type {TextosAdministracion} from '../../../../demo/administracion';
export interface EditorContenidoProps {
  estado: ReturnType<typeof useAdministracion>;
  textos: TextosAdministracion;
}
export default function EditorContenido({estado, textos}: EditorContenidoProps) {
  const id = useId();
  const instancia = estado.instancias.find((item) => item.slug === estado.editando);
  if (!instancia) throw new Error('Pieza de edición no disponible.');
  return (
    <section
      aria-labelledby={`${id}-titulo`}
      className="min-w-0 space-y-5 rounded-2xl bg-brand-light p-5"
    >
      <h3 id={`${id}-titulo`} className="break-words text-xl font-bold">
        {textos.editor}
      </h3>
      <label htmlFor={id} className="block font-semibold">
        {textos.elegir}
      </label>
      <select
        id={id}
        value={estado.editando}
        onChange={(evento) => estado.setEditando(evento.target.value)}
        className="block w-full min-w-0 rounded-xl border border-brand-ink/40 bg-white p-3 focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-2 focus-visible:outline-brand-sky-text"
      >
        {registro.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.nombre}
          </option>
        ))}
      </select>
      <p className="break-words text-sm">{textos.enVivo}</p>
      <div className="grid min-w-0 gap-5 sm:grid-cols-2">
        {instancia.campos.map((campo) => (
          <CampoEditor
            key={`${instancia.slug}:${campo.ruta.join('.')}`}
            campo={campo}
            textos={textos}
            imagenes={estado.imagenes}
            actualizar={(campo, valor) => estado.actualizar(instancia.slug, campo, valor)}
          />
        ))}
      </div>
    </section>
  );
}
