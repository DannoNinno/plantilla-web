'use client';

import Image from 'next/image';

import LoginComponent from '@/components/auth/LoginComponent/LoginComponent';
import SaleCarrusel, {OfertaProps} from '@/components/common/SaleCarrusel/SaleCarrusel';

const catalogoEjemplo: OfertaProps[] = [
  {
    id: 1,
    title: 'Casa en la playa',
    image: '/images/design/logo-example.png',
    link: 'https://ejemplo.com/casa1',
    price: '$250,000',
    description: 'Hermosa casa frente al mar con 3 habitaciones y piscina.',
  },
  {
    id: 2,
    title: 'Departamento céntrico',
    image: '/images/design/logo-example.png',
    link: 'https://ejemplo.com/casa2',
    price: '$180,000',
    description: 'Moderno departamento en el corazón de la ciudad.',
  },
  {
    id: 3,
    title: 'Casa de campo',
    image: '/images/design/logo-example.png',
    link: 'https://ejemplo.com/casa3',
    price: '$320,000',
    description: 'Amplia casa de campo rodeada de naturaleza.',
  },
  {
    id: 4,
    title: 'Penthouse de lujo',
    image: '/images/design/logo-example.png',
    link: 'https://ejemplo.com/casa4',
    price: '$850,000',
    description: 'Penthouse con vista panorámica, terraza privada y acabados premium.',
  },
  {
    id: 5,
    title: 'Loft moderno',
    image: '/images/design/logo-example.png',
    link: 'https://ejemplo.com/casa5',
    price: '$210,000',
    description: 'Loft con diseño industrial, ideal para jóvenes profesionales.',
  },
  {
    id: 6,
    title: 'Residencia familiar',
    image: '/images/design/logo-example.png',
    link: 'https://ejemplo.com/casa6',
    price: '$400,000',
    description: 'Residencia amplia con jardín, perfecta para familias grandes.',
  },
  {
    id: 7,
    title: 'Cabaña en el bosque',
    image: '/images/design/logo-example.png',
    link: 'https://ejemplo.com/casa7',
    price: '$150,000',
    description: 'Cabaña acogedora rodeada de naturaleza y tranquilidad.',
  },
  {
    id: 8,
    title: 'Estudio minimalista',
    image: '/images/design/logo-example.png',
    link: 'https://ejemplo.com/casa8',
    price: '$120,000',
    description: 'Estudio compacto y funcional en zona céntrica.',
  },
];

const Home: React.FC = () => {
  return (
    <div className="border-4 border-primaryBlue-900">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6">
        <div className="flex flex-col items-stretch rounded-xl border-[3px] border-primaryBlue-700 bg-primaryBlue-300 p-2 shadow-lg">
          <Image
            src="/images/design/logo-example.png"
            alt="Logo"
            width={128}
            height={128}
            className="m-3 self-center"
            priority
          />
          <div className="flex justify-center mt-2">
            <LoginComponent mode="modulo" />
          </div>
        </div>
      </div>
      {/* Carrusel de ofertas */}
      <div className="max-w-5xl mx-auto mt-8">
        <SaleCarrusel titulo="Ofertas destacadas" catalogo={catalogoEjemplo} />
      </div>
    </div>
  );
};

export default Home;
