export default function ErrorCarga({ texto, onReintentar }) {
  return (
    <div className="carga-error">
      <p>{texto}</p>
      <button type="button" onClick={onReintentar}>
        Volver a intentar
      </button>
    </div>
  );
}
