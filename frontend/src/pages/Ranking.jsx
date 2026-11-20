import { useState } from "react";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";
import Categoria from "../components/Categoria.jsx";
import { Corona, Medalla } from "../components/Recortes.jsx";
import { formatearFecha, formatearDuracion } from "../utils/formato.js";

// colores de las medallas del 2do y 3er puesto
const PLATA = { claro: "#e3e6ea", oscuro: "#7b838c" };
const BRONCE = { claro: "#e0a46a", oscuro: "#8a4f1d" };

// clase CSS de cada puesto: le da el borde dorado, plateado o bronce
const CLASE_PUESTO = ["oro", "plata", "bronce"];

// número de puesto -> el recorte que lleva en la esquina (o nada)
function Insignia({ puesto }) {
  if (puesto === 1) return <span className="insignia"><Corona /></span>;
  if (puesto === 2) return <span className="insignia"><Medalla metal={PLATA} texto="2" /></span>;
  if (puesto === 3) return <span className="insignia"><Medalla metal={BRONCE} texto="3" /></span>;
  return null;
}

export default function Ranking() {
  // "" = ranking general; si no, el nombre de la categoría
  const [categoria, setCategoria] = useState("");
  const categorias = useDatos("/preguntas/categorias");
  // al cambiar la ruta, useDatos vuelve a pedir el ranking solo
  const ruta = categoria ? "/ranking?categoria=" + encodeURIComponent(categoria) : "/ranking";
  const { datos, cargando, error, recargar } = useDatos(ruta);

  const pestanas = [["", "General"], ...(categorias.datos || []).map((c) => [c, c])];

  return (
    <section className="pantalla">
      <h2>Ranking</h2>
      <p className="vacio">Top 10 por puntaje. Si empatan, gana la partida más rápida y después la más antigua.</p>
      {/* aria-pressed le dice al lector de pantalla cuál pestaña está elegida */}
      <div className="pestanas">
        {pestanas.map(([valor, texto]) => (
          <button key={texto} type="button" aria-pressed={categoria === valor} onClick={() => setCategoria(valor)}>
            {texto}
          </button>
        ))}
      </div>
      {cargando && <Cargando texto="Cargando ranking..." />}
      {error && <ErrorCarga texto={error} onReintentar={recargar} />}
      {!cargando && datos && datos.length === 0 && (
        <p className="vacio">Todavía no hay partidas completadas{categoria ? " de " + categoria : ""} para el ranking.</p>
      )}
      {!cargando && datos && datos.length > 0 && (
        // una lista ordenada (ol) en vez de tabla: cada puesto es una tarjeta y así se puede decorar
        <ol className="ranking">
          {datos.map((partida, indice) => {
            const puesto = indice + 1;
            return (
              <li key={partida.id} className={"puesto " + (CLASE_PUESTO[indice] || "")}>
                <Insignia puesto={puesto} />
                <span className="numero">#{puesto}</span>
                <div className="jugador">
                  <strong>{partida.usuario}</strong>
                  <span className="detalle">
                    <Categoria nombre={partida.categoria} /> {formatearDuracion(partida.duracion)} · {formatearFecha(partida.fin)}
                  </span>
                </div>
                <span className="puntos">
                  {partida.puntaje}
                  <small>pts</small>
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
