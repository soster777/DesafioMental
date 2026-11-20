import { useEffect, useRef, useState } from "react";

const COLORES = ["#9e1b1b", "#f6ecd4", "#3d5a80", "#e8c35a"];
const DURACION_GIRO = 3200;

export default function Ruleta({ categorias, onElegir }) {
  const [giro, setGiro] = useState(0);
  const [girando, setGirando] = useState(false);
  const espera = useRef(null);

  useEffect(() => {
    return () => clearTimeout(espera.current);
  }, []);

  const porcion = 360 / categorias.length;
  const gajos = categorias
    .map((c, i) => COLORES[i % COLORES.length] + " " + i * porcion + "deg " + (i + 1) * porcion + "deg")
    .join(", ");

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
              className={"ruleta-texto" + (i % COLORES.length === 1 || i % COLORES.length === 3 ? " oscuro" : "")}
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
