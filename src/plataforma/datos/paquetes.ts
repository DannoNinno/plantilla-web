import {paquetes} from '@/configuracion/paquetes';

export function getPaquetes() {
  return paquetes;
}

export function getPaquete(id: string) {
  return paquetes.find((paquete) => paquete.id === id);
}
