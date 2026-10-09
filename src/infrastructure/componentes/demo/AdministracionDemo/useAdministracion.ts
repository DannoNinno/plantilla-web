'use client';
import {useState} from 'react';
import {negocio} from '../../../../demo/negocio';
import {cambiarSeleccion, marcarMensaje, eliminarMensaje} from '../../../../demo/administracion';
import type {MensajeDemo} from '../../../../demo/administracion';
import type {ConsultaContacto} from '../../base/consulta/tipos';
import {registro} from '../../boveda/registro';
import {esImagen} from '../../boveda/edicion/campos';
import type {CampoEditable} from '../../boveda/edicion/campos';
import type {ValorEditable} from '../../boveda/edicion/actualizar';
const disponibles = registro.filter((item) => item.enDemo && item.cuentaParaTope);
const fijas = ['portada', 'formulario-contacto'];
const textos = negocio.interfaz.administracion;
const inicial = () => registro.map((item) => item.crearInstancia());
const imagenes = inicial()
  .flatMap((item) => item.campos)
  .filter((campo) => campo.tipo === 'imagen')
  .map((campo) => campo.valor);
const imagenesUnicas = imagenes.filter(
  (imagen, indice) => imagenes.findIndex((item) => item.src === imagen.src) === indice,
);
export default function useAdministracion() {
  const [instancias, setInstancias] = useState(inicial);
  const [seleccion, setSeleccion] = useState(negocio.interfaz.planes.captacion.secciones);
  const [administrador, setAdministrador] = useState(false);
  const [editando, setEditando] = useState('portada');
  const [mensajes, setMensajes] = useState<MensajeDemo[]>([]);
  const [aviso, setAviso] = useState('');
  const [version, setVersion] = useState(0);
  function alternar(slug: string) {
    if (!seleccion.includes(slug) && seleccion.length >= negocio.interfaz.planes.captacion.limite) {
      setAviso(textos.limite);
      return;
    }
    setSeleccion((actual) =>
      cambiarSeleccion(
        actual,
        slug,
        disponibles.map((item) => item.slug),
        negocio.interfaz.planes.captacion.limite,
        fijas,
      ),
    );
    setAviso('');
  }
  function actualizar(
    slug: string,
    campo: CampoEditable,
    valor: ValorEditable,
  ): string | undefined {
    if (campo.tipo === 'texto' && (typeof valor !== 'string' || !valor.trim()))
      return textos.errorTexto;
    if (typeof valor === 'string' && valor.length > textos.maximoTexto) return textos.errorLongitud;
    if (
      campo.tipo === 'numero' &&
      (typeof valor !== 'number' || !Number.isSafeInteger(valor) || valor < 0)
    )
      return textos.errorNumero;
    if (
      campo.tipo === 'imagen' &&
      (!esImagen(valor) ||
        !imagenesUnicas.some(
          (item) =>
            item.src === valor.src &&
            item.width === valor.width &&
            item.height === valor.height &&
            item.alt === valor.alt,
        ))
    )
      return textos.errorImagen;
    setInstancias((actual) =>
      actual.map((item) => (item.slug === slug ? item.actualizar(campo.ruta, valor) : item)),
    );
    return undefined;
  }
  function recibir(origen: string, consulta: ConsultaContacto) {
    setMensajes((actual) => [
      ...actual,
      {...consulta, origen, leido: false, id: (actual.at(-1)?.id ?? 0) + 1},
    ]);
  }
  function restablecer() {
    setInstancias(inicial());
    setSeleccion(negocio.interfaz.planes.captacion.secciones);
    setMensajes([]);
    setEditando('portada');
    setVersion((actual) => actual + 1);
    setAviso(textos.restablecido);
  }
  return {
    instancias,
    seleccion,
    administrador,
    editando,
    mensajes,
    aviso,
    version,
    disponibles,
    fijas,
    imagenes: imagenesUnicas,
    alternar,
    actualizar,
    recibir,
    restablecer,
    setEditando,
    alternarVista: () => setAdministrador((actual) => !actual),
    marcar: (id: number) => setMensajes((actual) => marcarMensaje(actual, id)),
    eliminar: (id: number) => setMensajes((actual) => eliminarMensaje(actual, id)),
  };
}
