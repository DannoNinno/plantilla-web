import Image from 'next/image';

export default function LogoSimulacion({oscuro = false}: {oscuro?: boolean}) {
  return (
    <Image
      src={`/dannotech-kit/svg/dannotech-isotipo-fondo-${oscuro ? 'oscuro' : 'claro'}.svg`}
      alt="DannoTech"
      width={102}
      height={88}
      className="h-12 w-auto shrink-0"
    />
  );
}
