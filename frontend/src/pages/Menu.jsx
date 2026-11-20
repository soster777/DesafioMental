import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context/AppContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";
import Houdini from "../components/Houdini.jsx";

export default function Menu() {
  const { usuario } = useApp();
  const stats = useDatos("/estadisticas");
  const categorias = useDatos("/preguntas/categorias");

  // { Historia: 60, Ciencia: null, ... } -> null quiere decir que todavía no jugó esa categoría
  const [porcentajes, setPorcentajes] = useState(null);
  const [errorPorcentajes, setErrorPorcentajes] = useState(false);

  const lista = categorias.datos || [];

  useEffect(() => {
    if (!categorias.datos) return;
    let vigente = true;

    // useEffect no puede ser async, así que armo la función async adentro y la llamo
    async function cargarPorcentajes() {
      try {
        const resultado = {};
        for (let i = 0; i < categorias.datos.length; i++) {
          const c = categorias.datos[i];
          const respuesta = await api.get("/estadisticas/" + encodeURIComponent(c));
          resultado[c] = respuesta.porcentaje;
        }
        if (vigente) setPorcentajes(resultado);
      } catch (error) {
        if (vigente) setErrorPorcentajes(true);
      }
    }
    cargarPorcentajes();

    return () => {
      vigente = false;
    };
  }, [categorias.datos]);

  const s = stats.datos;

  return (
    <section className="pantalla menu">
      <div className="marquesina">
        <p className="marquesina-sub">Esta noche, función especial para</p>
        <h2>{usuario.usuario}</h2>
      </div>

      <div className="escenario">
        <Houdini />
      </div>

      <Link to="/jugar" className="boton-funcion">
        <span>¡A jugar!</span>
        <small>Entrada N° {("000000" + usuario.id).slice(-6)}</small>
      </Link>

      {stats.cargando && <Cargando texto="Cargando estadísticas..." />}
      {stats.error && <ErrorCarga texto={stats.error} onReintentar={stats.recargar} />}
      {s && !stats.cargando && (
        <ul className="fichas">
          <li><strong>{s.completadas}</strong><span>Partidas</span></li>
          <li><strong>{s.respondidas}</strong><span>Respondidas</span></li>
          <li><strong>{s.porcentaje}%</strong><span>Aciertos</span></li>
          <li><strong>{s.mejorPuntaje}</strong><span>Récord</span></li>
          <li><strong>{s.mejorRacha}</strong><span>Mejor racha</span></li>
        </ul>
      )}

      <h3>Aciertos por categoría</h3>
      {categorias.error && (
        <ErrorCarga texto="No se pudieron cargar las categorías." onReintentar={categorias.recargar} />
      )}
      {errorPorcentajes && <p className="carga-error">No se pudieron cargar los porcentajes.</p>}
      {!porcentajes && !errorPorcentajes && lista.length > 0 && <Cargando texto="Cargando porcentajes..." />}
      {porcentajes && (
        <div className="medallero">
          {lista.map((c) => {
            const valor = porcentajes[c];
            return (
              <div key={c} className="medalla-aciertos">
                <span className="circulo-aciertos" style={{ "--valor": (valor || 0) * 3.6 + "deg" }}>
                  {valor === null ? "—" : valor + "%"}
                </span>
                <span>{c}</span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
