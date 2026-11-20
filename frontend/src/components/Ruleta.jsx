import { useEffect, useRef, useState } from "react";

const COLORES = [
  { fondo: "#9e1b1b", oscuro: false },
  { fondo: "#f6ecd4", oscuro: true },
  { fondo: "#3d5a80", oscuro: false },
  { fondo: "#e8c35a", oscuro: true },
  { fondo: "#3d6b35", oscuro: false },
];
const DURACION_GIRO = 3200;

// [String] -> [Color]
// la rueda es circular: el último gajo toca al primero, así que tampoco puede repetir su color
function colorearGajos(categorias) {
  const colores = [];
  for (let i = 0; i < categorias.length; i++) {
    let color = COLORES[i % COLORES.length];
    const esUltimo = i > 0 && i === categorias.length - 1;
    if (esUltimo && color === colores[0]) {
      color = COLORES.find((c) => c !== colores[0] && c !== colores[i - 1]);
    }
    colores.push(color);
  }
  return colores;
}

export default function Ruleta({ categorias, onElegir }) {
  const [giro, setGiro] = useState(0);
  const [girando, setGirando] = useState(false);
  const espera = useRef(null);

  useEffect(() => {
    return () => clearTimeout(espera.current);
  }, []);

  const porcion = 360 / categorias.length;
  const colores = colorearGajos(categorias);
  const gajos = colores.map((c, i) => c.fondo + " " + i * porcion + "deg " + (i + 1) * porcion + "deg").join(", ");

  function girar() {
    const elegida = Math.floor(Math.random() * categorias.length);
    const centro = elegida * porcion + porcion / 2;
    // cuántos grados faltan para que el centro de la porción elegida quede arriba, debajo de la flecha
    const falta = (360 - centro - (giro % 360) + 360) % 360;
    setGiro(giro + 5 * 360 + falta);
    setGirando(true);
    espera.current = setTimeout(() => {
      setGirando(false);
      onElegir(categorias[elegida]);
    }, DURACION_GIRO);
  }

  return (
    <div className="ruleta">
      <div className="ruleta-rueda-marco" aria-hidden="true">
        <span className="ruleta-flecha" />
        <div
          className="ruleta-rueda"
          style={{ background: "conic-gradient(" + gajos + ")", transform: "rotate(" + giro + "deg)" }}
        >
          {categorias.map((c, i) => (
            <span
              key={c}
              className={"ruleta-texto" + (colores[i].oscuro ? " oscuro" : "")}
              style={{ transform: "rotate(" + (i * porcion + porcion / 2) + "deg)" }}
            >
              {c}
            </span>
          ))}
          <span className="ruleta-centro" />
        </div>
      </div>
      <button type="button" className="secundario" onClick={girar} disabled={girando || categorias.length === 0}>
        {girando ? "Girando..." : "¡Que decida la suerte!"}
      </button>
    </div>
  );
}
