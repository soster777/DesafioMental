import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context/AppContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";
import Categoria, { colorDeCategoria } from "../components/Categoria.jsx";
import { formatearDuracion, formatearFecha, porcentajeDePartida, mensajeSegunPorcentaje } from "../utils/formato.js";

export default function Resultados() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mostrarMensaje } = useApp();
  const { datos: partida, cargando, error, recargar } = useDatos("/partidas/" + id);
  const [creando, setCreando] = useState(false);

  async function nuevaPartida() {
    setCreando(true);
    try {
      const nueva = await api.post("/partidas", { categoria: partida.categoria, cantidad: partida.preguntas.length });
      navigate("/partida/" + nueva.id);
    } catch (e) {
      mostrarMensaje(e.message, "error");
      setCreando(false);
    }
  }

  if (cargando) {
    return <Cargando texto="Cargando resultados..." />;
  }
  if (error) {
    return <ErrorCarga texto={error} onReintentar={recargar} />;
  }
  if (partida.estado !== "completada") {
    return <Navigate to="/menu" replace />;
  }

  const porcentaje = porcentajeDePartida(partida);

  return (
    <section className="pantalla resultados">
      <h2>Resultados</h2>

      <div className="resultado-cabecera">
        <span
          className="circulo-aciertos"
          style={{ "--valor": porcentaje * 3.6 + "deg", "--color-categoria": colorDeCategoria(partida.categoria).borde }}
        >
          {porcentaje}%
        </span>
        <div>
          <p className="resultado-puntaje">
            <strong>{partida.puntaje}</strong> puntos
          </p>
          <p className="destacado">{mensajeSegunPorcentaje(porcentaje)}</p>
          <p className="resultado-meta">
            <Categoria nombre={partida.categoria} /> {formatearFecha(partida.fin)}
          </p>
        </div>
      </div>

      <ul className="fichas">
        <li><strong>{partida.correctas}</strong><span>Correctas</span></li>
        <li><strong>{partida.incorrectas}</strong><span>Incorrectas</span></li>
        <li><strong>{partida.mejorRacha}</strong><span>Mejor racha</span></li>
        <li><strong>{formatearDuracion(partida.duracion)}</strong><span>Duración</span></li>
      </ul>

      <nav className="acciones">
        <button type="button" onClick={nuevaPartida} disabled={creando}>
          Nueva partida
        </button>
        <button type="button" className="secundario" onClick={() => navigate("/menu")}>
          Volver al menú
        </button>
      </nav>
    </section>
  );
}
