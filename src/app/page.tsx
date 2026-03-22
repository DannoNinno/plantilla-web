'use client';


import LoginComponent from '@/components/Common/LoginComponent/LoginComponent';
import SaleCarrusel, { OfertaProps } from '@/components/Common/SaleCarrusel/SaleCarrusel';


const catalogoEjemplo: OfertaProps[] = [
  {
    id: 1,
    title: 'Casa en la playa',
    image: '/images/logo-example.png',
    link: 'https://ejemplo.com/casa1',
    price: '$250,000',
    description: 'Hermosa casa frente al mar con 3 habitaciones y piscina.'
  },
  {
    id: 2,
    title: 'Departamento céntrico',
    image: '/images/logo-example.png',
    link: 'https://ejemplo.com/casa2',
    price: '$180,000',
    description: 'Moderno departamento en el corazón de la ciudad.'
  },
  {
    id: 3,
    title: 'Casa de campo',
    image: '/images/logo-example.png',
    link: 'https://ejemplo.com/casa3',
    price: '$320,000',
    description: 'Amplia casa de campo rodeada de naturaleza.'
  },
  {
    id: 4,
    title: 'Penthouse de lujo',
    image: '/images/logo-example.png',
    link: 'https://ejemplo.com/casa4',
    price: '$850,000',
    description: 'Penthouse con vista panorámica, terraza privada y acabados premium.'
  },
  {
    id: 5,
    title: 'Loft moderno',
    image: '/images/logo-example.png',
    link: 'https://ejemplo.com/casa5',
    price: '$210,000',
    description: 'Loft con diseño industrial, ideal para jóvenes profesionales.'
  },
  {
    id: 6,
    title: 'Residencia familiar',
    image: '/images/logo-example.png',
    link: 'https://ejemplo.com/casa6',
    price: '$400,000',
    description: 'Residencia amplia con jardín, perfecta para familias grandes.'
  },
  {
    id: 7,
    title: 'Cabaña en el bosque',
    image: '/images/logo-example.png',
    link: 'https://ejemplo.com/casa7',
    price: '$150,000',
    description: 'Cabaña acogedora rodeada de naturaleza y tranquilidad.'
  },
  {
    id: 8,
    title: 'Estudio minimalista',
    image: '/images/logo-example.png',
    link: 'https://ejemplo.com/casa8',
    price: '$120,000',
    description: 'Estudio compacto y funcional en zona céntrica.'
  },
];

const Home: React.FC = () => {
  return (
    <div className="border-4 border-primaryBlue-900">
      <div className="w-50 h-screen flex justify-center items-center self-center mx-auto">
        <div className="p-2 bg-primaryBlue-300 border-3 border-primaryBlue-700 flex items-stretch flex-col rounded-xl">
          <img src="/images/logo-example.png" alt="Logo" className="self-center w-32 h-32 m-3" />
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
