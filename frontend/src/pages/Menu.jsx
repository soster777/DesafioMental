import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context/AppContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";
import Datos from "../components/Datos.jsx";
import Houdini from "../components/Houdini.jsx";
import Boleto from "../components/Boleto.jsx";

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

  return (
    <section className="pantalla con-houdini con-boleto-abajo">
      <Boleto numero={usuario.id} abajo />
      <h2>Hola, {usuario.usuario}</h2>
      <Houdini />
      <Link to="/jugar" className="boton-link boton-jugar">¡A jugar!</Link>

      <h3>Tus estadísticas</h3>
      {stats.cargando && <Cargando texto="Cargando estadísticas..." />}
      {stats.error && <ErrorCarga texto={stats.error} onReintentar={stats.recargar} />}
      {stats.datos && !stats.cargando && (
        <Datos
          datos={[
            ["Partidas completadas", stats.datos.completadas],
            ["Preguntas respondidas", stats.datos.respondidas],
            ["Aciertos", stats.datos.porcentaje + "%"],
            ["Puntaje más alto", stats.datos.mejorPuntaje],
            ["Mejor racha", stats.datos.mejorRacha],
          ]}
        />
      )}

      <h3>Aciertos por categoría</h3>
      {categorias.error && (
        <ErrorCarga texto="No se pudieron cargar las categorías." onReintentar={categorias.recargar} />
      )}
      {errorPorcentajes && <p className="carga-error">No se pudieron cargar los porcentajes.</p>}
      {!porcentajes && !errorPorcentajes && lista.length > 0 && <Cargando texto="Cargando porcentajes..." />}
      {porcentajes && (
        <ul className="porcentajes">
          {lista.map((c) => {
            const valor = porcentajes[c];
            return (
              <li key={c}>
                <span className="nombre">{c}</span>
                <span className="barra-porcentaje">
                  <span style={{ width: (valor || 0) + "%" }} />
                </span>
                <span className={valor === null ? "valor sin-jugar" : "valor"}>
                  {valor === null ? "Sin jugar" : valor + "%"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
