'use client';

import {useEffect, useRef, useState} from 'react';
import type {FormEvent} from 'react';
import {crearEsquemaConsulta} from '../../../../domain/servicios/consulta';
import type {
  ConfiguracionConsulta,
  DatosConsulta,
  ResultadoConsulta,
} from '../../../../domain/types/consulta';

export interface FormularioConsultaProps {
  config: ConfiguracionConsulta;
  enviar: (datos: DatosConsulta, trampa: string) => Promise<ResultadoConsulta>;
  preparado: boolean;
  planInicial?: string;
  mensajeEtiqueta?: string;
}

export function useConsulta({config, enviar, preparado}: FormularioConsultaProps) {
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<DatosConsulta | null>(null);
  const [mensaje, setMensaje] = useState('');
  const ocupado = useRef(false);
  const formulario = useRef<HTMLFormElement>(null);
  const exito = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (resultado) exito.current?.focus();
    else if (Object.keys(errores).length)
      formulario.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [resultado, errores]);
  async function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (ocupado.current || !preparado) return;
    const campos = new FormData(evento.currentTarget);
    const validado = crearEsquemaConsulta(config).safeParse({
      ...Object.fromEntries(campos),
      consentimiento: campos.has('consentimiento'),
      versionAviso: config.aviso.version,
    });
    setError('');
    const siguientes: Record<string, string> = {};
    if (!validado.success) {
      for (const problema of validado.error.issues)
        siguientes[String(problema.path[0] ?? 'formulario')] ??= problema.message;
      setErrores(siguientes);
      return;
    }
    ocupado.current = true;
    setEnviando(true);
    setErrores({});
    try {
      const respuesta = await enviar(validado.data, String(campos.get('sitioWeb') ?? ''));
      if (respuesta.ok) setResultado(validado.data);
      else {
        setError(respuesta.mensaje);
        setErrores(respuesta.errores ?? {});
      }
    } catch {
      console.error('consulta fallida: no se pudo confirmar el envío');
      setError(
        `No pude enviar tu consulta. Inténtalo de nuevo o escríbeme a ${config.correoContacto}.`,
      );
    } finally {
      ocupado.current = false;
      setEnviando(false);
    }
  }
  function reiniciar() {
    setResultado(null);
    setMensaje('');
    setErrores({});
    setError('');
  }
  return {
    errores,
    error,
    enviando,
    resultado,
    mensaje,
    setMensaje,
    formulario,
    exito,
    enviarFormulario,
    reiniciar,
  };
}
