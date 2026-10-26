export default function EstadoEnvio({error, exito}: {error: string | null; exito: boolean}) {
  return (
    <>
      {error && (
        <p role="alert" className="text-sm text-brand-coral-dark">
          {error}
        </p>
      )}
      {exito && (
        <p role="status" className="text-sm font-semibold">
          Tu solicitud quedó guardada. Gracias por escribirme.
        </p>
      )}
    </>
  );
}
