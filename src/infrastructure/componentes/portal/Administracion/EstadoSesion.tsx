'use client';

import {useSesionAdmin} from '../../../../modules/administracion/useSesionAdmin';

export default function EstadoSesion() {
  const error = useSesionAdmin();
  return error ? (
    <p role="alert" className="mb-6 text-sm text-brand-coral">
      {error}
    </p>
  ) : null;
}
