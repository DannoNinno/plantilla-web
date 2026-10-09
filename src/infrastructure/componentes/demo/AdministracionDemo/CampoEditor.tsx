'use client';
import {useEffect, useId, useState} from 'react';
import type {TextosAdministracion} from '../../../../demo/administracion';
import type {ImagenContenidoDatos} from '../../base/ImagenContenido/ImagenContenido';
import type {CampoEditable} from '../../boveda/edicion/campos';
import type {ValorEditable} from '../../boveda/edicion/actualizar';
export interface CampoEditorProps {
  campo: CampoEditable;
  textos: TextosAdministracion;
  imagenes: readonly ImagenContenidoDatos[];
  actualizar: (campo: CampoEditable, valor: ValorEditable) => string | undefined;
}
export default function CampoEditor({campo, textos, imagenes, actualizar}: CampoEditorProps) {
  const id = useId();
  const canonico = campo.tipo === 'imagen' ? campo.valor.src : String(campo.valor);
  const [valor, setValor] = useState(canonico);
  const [error, setError] = useState<string>();
  useEffect(() => setValor(canonico), [canonico]);
  const etiqueta = campo.ruta
    .map((clave) =>
      /^\d+$/.test(clave) ? String(Number(clave) + 1) : (textos.etiquetas[clave] ?? clave),
    )
    .join(' / ');
  function cambiar(texto: string) {
    setValor(texto);
    if (campo.tipo === 'imagen') {
      const imagen = imagenes.find((item) => item.src === texto);
      setError(imagen ? actualizar(campo, imagen) : textos.errorImagen);
    } else
      setError(
        actualizar(campo, campo.tipo === 'numero' ? (texto.trim() ? Number(texto) : NaN) : texto),
      );
  }
  const comunes = {
    id,
    value: valor,
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
    className:
      'mt-2 w-full min-w-0 rounded-xl border border-brand-ink/40 bg-white p-3 text-brand-ink focus-visible:outline focus-visible:outline-foco focus-visible:outline-offset-2 focus-visible:outline-brand-sky-text',
  };
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="block break-words text-sm font-semibold">
        {etiqueta}
      </label>
      {campo.tipo === 'imagen' ? (
        <select
          {...comunes}
          onChange={(evento) => cambiar(evento.target.value)}
          aria-label={`${etiqueta}: ${textos.imagenes}`}
        >
          {imagenes.map((imagen) => (
            <option key={imagen.src} value={imagen.src}>
              {imagen.alt}
            </option>
          ))}
        </select>
      ) : campo.tipo === 'numero' ? (
        <input
          {...comunes}
          type="number"
          min={0}
          step={1}
          onChange={(evento) => cambiar(evento.target.value)}
        />
      ) : (
        <textarea
          {...comunes}
          rows={2}
          maxLength={textos.maximoTexto}
          onChange={(evento) => cambiar(evento.target.value)}
        />
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 break-words text-sm font-semibold">
          {error}
        </p>
      )}
    </div>
  );
}
