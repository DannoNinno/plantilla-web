'use client';

import {useActionState} from 'react';
import {login} from '@/app/admin/acciones';

export default function Login({configurado}: {configurado: boolean}) {
  const [estado, accion, pendiente] = useActionState(login, {error: ''});
  return (
    <form action={accion} className="tarjeta mt-6 space-y-5">
      {!configurado && (
        <p role="status" className="rounded-xl bg-brand-light p-4 text-sm">
          Antes de ingresar, configura ADMIN_EMAIL y ADMIN_PASSWORD_HASH en el servidor. No existe
          una clave predeterminada.
        </p>
      )}
      <label className="block text-sm">
        Correo del administrador
        <input
          className="campo mt-2"
          name="correo"
          type="email"
          autoComplete="username"
          required
          maxLength={254}
        />
      </label>
      <label className="block text-sm">
        Clave
        <input
          className="campo mt-2"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          maxLength={256}
        />
      </label>
      <button
        className="boton w-full bg-brand-ink text-white disabled:opacity-60"
        disabled={pendiente || !configurado}
      >
        {pendiente ? 'Ingresando...' : 'Ingresar al panel'}
      </button>
      {estado.error && (
        <p role="alert" className="text-sm text-brand-coral-dark">
          {estado.error}
        </p>
      )}
    </form>
  );
}
