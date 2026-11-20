// datos: lista de pares [etiqueta, valor]
export default function Datos({ datos }) {
  return (
    <dl className="stats">
      {datos.map(([etiqueta, valor]) => (
        <div key={etiqueta}>
          <dt>{etiqueta}</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  );
}
