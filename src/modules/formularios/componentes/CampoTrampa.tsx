export default function CampoTrampa() {
  return (
    <div hidden aria-hidden="true">
      <label>
        Sitio web
        <input name="sitioWeb" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
