import Image from 'next/image';

export interface OfertaProps {
  id: string | number;
  title: string;
  image: string;
  link: string;
  price?: string;
  description?: string;
}

export interface SaleCarruselProps {
  titulo: string;
  catalogo: OfertaProps[];
}

const SaleCarrusel: React.FC<SaleCarruselProps> = ({titulo, catalogo}) => {
  return (
    <section
      className="w-screen max-w-none left-1/2 right-1/2 -translate-x-1/2 py-10 bg-blue-900"
      style={{position: 'relative', left: '50%', right: '50%', transform: 'translateX(-50%)'}}
    >
      <h2 className="text-xl font-bold mb-4 text-blue-50 text-center">{titulo}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {catalogo.map((oferta) => (
          <a
            key={oferta.id}
            href={oferta.link}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border border-sky-100 hover:border-sky-300 duration-200 flex flex-col"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={oferta.image}
              alt={oferta.title}
              width={640}
              height={288}
              className="w-full h-36 object-cover rounded-t-xl"
            />
            <div className="p-3 flex-1 flex flex-col">
              <h3 className="font-semibold text-sky-700 text-base mb-1 truncate">{oferta.title}</h3>
              {oferta.price && (
                <div className="text-sky-600 font-bold text-sm mb-1">{oferta.price}</div>
              )}
              {oferta.description && (
                <div className="text-xs text-gray-500 line-clamp-2 flex-1">
                  {oferta.description}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default SaleCarrusel;
