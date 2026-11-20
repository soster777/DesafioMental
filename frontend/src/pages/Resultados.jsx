import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context/AppContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";
import Datos from "../components/Datos.jsx";
import Categoria from "../components/Categoria.jsx";
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
    <section className="pantalla">
      <h2>Resultados</h2>
      <p className="destacado">{mensajeSegunPorcentaje(porcentaje)}</p>
      <Datos
        datos={[
          ["Puntaje total", partida.puntaje],
          ["Correctas", partida.correctas],
          ["Incorrectas", partida.incorrectas],
          ["Aciertos", porcentaje + "%"],
          ["Mejor racha", partida.mejorRacha],
          ["Duración", formatearDuracion(partida.duracion)],
          ["Categoría", <Categoria nombre={partida.categoria} />],
          ["Finalizó", formatearFecha(partida.fin)],
        ]}
      />
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
