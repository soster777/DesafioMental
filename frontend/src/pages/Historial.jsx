import { useState } from "react";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";
import Categoria from "../components/Categoria.jsx";
import { formatearFecha } from "../utils/formato.js";

const ESTADOS = [
  ["todas", "Todas"],
  ["completada", "Completadas"],
  ["abandonada", "Abandonadas"],
];

export default function Historial() {
  const [categoria, setCategoria] = useState("todas");
  const [estado, setEstado] = useState("todas");
  const categorias = useDatos("/preguntas/categorias");
  // al cambiar un filtro cambia la ruta, y useDatos vuelve a pedir el historial
  const historial = useDatos("/partidas?categoria=" + encodeURIComponent(categoria) + "&estado=" + estado);

  return (
    <section className="pantalla">
      <h2>Historial</h2>
      {historial.datos && (
        <div className="revision">
          <strong>Revisión del historial:</strong> {historial.datos.resumen.completadas} completadas,{" "}
          {historial.datos.resumen.abandonadas} abandonadas, {historial.datos.resumen.puntaje} puntos acumulados.
        </div>
      )}

      {/* filtros como pestañas, igual que en el ranking: cada lista es [valor, texto] */}
      <p className="rotulo" id="rotulo-hist-categoria">Categoría</p>
      <div className="pestanas" role="group" aria-labelledby="rotulo-hist-categoria">
        {[["todas", "Todas"], ...(categorias.datos || []).map((c) => [c, c])].map(([valor, texto]) => (
          <button key={valor} type="button" aria-pressed={categoria === valor} onClick={() => setCategoria(valor)}>
            {texto}
          </button>
        ))}
      </div>
      <p className="rotulo" id="rotulo-hist-estado">Estado</p>
      <div className="pestanas" role="group" aria-labelledby="rotulo-hist-estado">
        {ESTADOS.map(([valor, texto]) => (
          <button key={valor} type="button" aria-pressed={estado === valor} onClick={() => setEstado(valor)}>
            {texto}
          </button>
        ))}
      </div>

      {historial.cargando && <Cargando texto="Cargando historial..." />}
      {historial.error && <ErrorCarga texto={historial.error} onReintentar={historial.recargar} />}
      {historial.datos && !historial.cargando && historial.datos.partidas.length === 0 && (
        <p className="vacio">Todavía no hay resultados disponibles.</p>
      )}
      {historial.datos && !historial.cargando && historial.datos.partidas.length > 0 && (
        <div className="tabla-scroll">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Categoría</th>
                <th>Puntaje</th>
                <th>Correctas</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historial.datos.partidas.map((partida) => (
                <tr key={partida.id}>
                  <td>{formatearFecha(partida.fin)}</td>
                  <td><Categoria nombre={partida.categoria} /></td>
                  <td>{partida.puntaje}</td>
                  <td>{partida.correctas}</td>
                  <td><span className={"sello " + partida.estado}>{partida.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
