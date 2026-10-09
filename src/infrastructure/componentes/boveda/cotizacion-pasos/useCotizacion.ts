'use client';
import {useEffect, useRef, useState} from 'react';
import type {FormEvent} from 'react';
import {erroresPaso, pasoPrimerError, validarSolicitud} from './validacion';
import type {ErroresCotizacion, FormularioCotizacionProps, SolicitudCotizacion} from './tipos';
const inicial: SolicitudCotizacion = {servicio: '', nombre: '', correo: '', mensaje: ''};

export default function useCotizacion(props: FormularioCotizacionProps) {
  const [valores, setValores] = useState(inicial);
  const [paso, setPaso] = useState<1 | 2 | 3>(1);
  const [errores, setErrores] = useState<ErroresCotizacion>({});
  const [enviado, setEnviado] = useState(false);
  const [habilitado, setHabilitado] = useState(false);
  const [foco, setFoco] = useState(0);
  const formularioRef = useRef<HTMLFormElement>(null);
  const resultadoRef = useRef<HTMLDivElement>(null);
  useEffect(() => setHabilitado(true), []);
  useEffect(() => {
    if (!foco) return;
    if (enviado) resultadoRef.current?.focus();
    else
      formularioRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"], [data-titulo-paso]')
        ?.focus();
  }, [foco, enviado]);
  function cambiar(campo: keyof SolicitudCotizacion, valor: string) {
    setValores((actual) => ({...actual, [campo]: valor}));
    setErrores((actual) => {
      const siguientes = {...actual};
      delete siguientes[campo];
      return siguientes;
    });
  }
  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const consulta = {
      ...valores,
      nombre: valores.nombre.trim(),
      correo: valores.correo.trim(),
      mensaje: valores.mensaje.trim(),
    };
    const todos = validarSolicitud(consulta, props);
    const visibles = paso === 3 ? todos : erroresPaso(todos, paso);
    setErrores(visibles);
    setFoco((actual) => actual + 1);
    if (Object.keys(visibles).length) {
      if (paso === 3) setPaso(pasoPrimerError(visibles));
      return;
    }
    if (paso !== 3) {
      setPaso(paso === 1 ? 2 : 3);
      return;
    }
    const servicio = props.campos.servicio.opciones.find(
      (opcion) => opcion.id === consulta.servicio,
    );
    if (!servicio) throw new Error('Servicio validado no disponible.');
    props.onConsulta?.({
      ...consulta,
      mensaje: `${props.campos.servicio.etiqueta}: ${servicio.texto}\n${consulta.mensaje}`,
    });
    setEnviado(true);
  }
  function anterior() {
    setPaso(paso === 3 ? 2 : 1);
    setErrores({});
    setFoco((actual) => actual + 1);
  }
  function reiniciar() {
    setValores(inicial);
    setPaso(1);
    setErrores({});
    setEnviado(false);
    setFoco((actual) => actual + 1);
  }
  return {
    valores,
    paso,
    errores,
    enviado,
    habilitado,
    formularioRef,
    resultadoRef,
    cambiar,
    enviar,
    anterior,
    reiniciar,
  };
}
