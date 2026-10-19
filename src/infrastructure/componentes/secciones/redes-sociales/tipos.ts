export interface EnlaceSocial {
  id: string;
  texto: string;
  href: string;
}

export interface RedesSocialesProps {
  etiqueta: string;
  descripcion?: string;
  enlaces?: readonly EnlaceSocial[];
}
