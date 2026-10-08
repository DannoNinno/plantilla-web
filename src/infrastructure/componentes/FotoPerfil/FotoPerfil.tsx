'use client';

import Image from 'next/image';
import {useState} from 'react';

export default function FotoPerfil() {
  const [cargada, setCargada] = useState(true);

  return (
    <div className="relative flex aspect-square max-w-sm items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white/10">
      <span aria-hidden="true" className="text-7xl font-semibold text-brand-sky">
        DS
      </span>
      <Image
        src="/perfil/daniel-salamanca.png"
        alt="Foto de Daniel Salamanca"
        fill
        sizes="(max-width: 1024px) 384px, 320px"
        className={`object-cover ${cargada ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setCargada(true)}
        onError={() => setCargada(false)}
      />
    </div>
  );
}
