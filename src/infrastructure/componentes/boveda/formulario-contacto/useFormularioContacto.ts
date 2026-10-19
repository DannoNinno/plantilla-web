'use client';

import {useEffect, useRef, useState} from 'react';
import type {FormEvent} from 'react';
import {validarConsulta} from './validacion';
import type {ConsultaContacto, ErroresContacto, FormularioContactoProps} from './tipos';

export function useFormularioContacto(props: FormularioContactoProps) {
  const [errores, setErrores] = useState<ErroresContacto>({});
  const [enviado, setEnviado] = useState(false);
  const [habilitado, setHabilitado] = useState(false);
  const resultadoRef = useRef<HTMLDivElement>(null);
  const nombreRef = useRef<HTMLInputElement>(null);
  const [reinicios, setReinicios] = useState(0);

  useEffect(() => setHabilitado(true), []);

  useEffect(() => {
    if (enviado) resultadoRef.current?.focus();
    else if (reinicios > 0) nombreRef.current?.focus();
  }, [enviado, reinicios]);

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const formulario = evento.currentTarget;
    const datos = new FormData(formulario);
    const consulta: ConsultaContacto = {
      nombre: String(datos.get('nombre') ?? '').trim(),
      correo: String(datos.get('correo') ?? '').trim(),
      mensaje: String(datos.get('mensaje') ?? '').trim(),
    };
    const nuevosErrores = validarConsulta(consulta, props);
    setErrores(nuevosErrores);
    const primerError = Object.keys(nuevosErrores)[0];
    if (primerError) {
      const campo = formulario.elements.namedItem(primerError);
      if (campo instanceof HTMLElement) campo.focus();
      return;
    }
    props.onConsulta?.(consulta);
    setEnviado(true);
  }

  function reiniciar() {
    setErrores({});
    setEnviado(false);
    setReinicios((valor) => valor + 1);
  }

  function limpiarErrores() {
    if (Object.keys(errores).length > 0) setErrores({});
  }

  return {errores, enviado, habilitado, enviar, reiniciar, limpiarErrores, resultadoRef, nombreRef};
}
