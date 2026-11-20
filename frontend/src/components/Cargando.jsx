export default function Cargando({ texto = "Cargando..." }) {
  return (
    <div className="carga">
      <div className="spinner"></div>
      <p>{texto}</p>
    </div>
  );
}
