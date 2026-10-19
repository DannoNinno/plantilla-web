const formatoCLP = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export function precioDesdeCLP(precio: number): string {
  return `Desde ${formatoCLP.format(precio)} CLP`;
}

export function formatoPrecioCLP(precio: number): string {
  return formatoCLP.format(precio);
}
