export default function Errores({ errores }) {
  return (
    <ul className="errores">
      {errores.map((error) => (
        <li key={error}>{error}</li>
      ))}
    </ul>
  );
}
