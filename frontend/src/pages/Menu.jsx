import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context/AppContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";
import Datos from "../components/Datos.jsx";
import Houdini from "../components/Houdini.jsx";
import Boleto from "../components/Boleto.jsx";

const CANTIDADES = [5, 10];

export default function Menu() {
  const { usuario, mostrarMensaje } = useApp();
  const navigate = useNavigate();
  const stats = useDatos("/estadisticas");
  const categorias = useDatos("/preguntas/categorias");

  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState(5);
  const [creando, setCreando] = useState(false);
  // { Historia: 60, Ciencia: null, ... } -> null quiere decir que todavía no jugó esa categoría
  const [porcentajes, setPorcentajes] = useState(null);
  const [errorPorcentajes, setErrorPorcentajes] = useState(false);

  // mientras no elija nada, uso la primera categoría que llegó del servidor
  const lista = categorias.datos || [];
  const categoriaJuego = categoria || lista[0] || "";

  // cuando llegan las categorías pido el porcentaje de cada una
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

    // si se sale del menú antes de que lleguen, descarto las respuestas
    return () => {
      vigente = false;
    };
  }, [categorias.datos]);

  async function jugar(event) {
    event.preventDefault();
    setCreando(true);
    try {
      const partida = await api.post("/partidas", { categoria: categoriaJuego, cantidad: cantidad });
      navigate("/partida/" + partida.id);
    } catch (error) {
      mostrarMensaje(error.message, "error");
      setCreando(false);
    }
  }

  return (
    <section className="pantalla con-houdini con-boleto-abajo">
      <Boleto numero={usuario.id} abajo />
      <h2>Hola, {usuario.usuario}</h2>
      <Houdini />

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

      <h3>Nueva partida</h3>
      {categorias.cargando && <Cargando texto="Cargando preguntas..." />}
      {categorias.error && (
        <ErrorCarga texto="No se pudieron cargar las preguntas." onReintentar={categorias.recargar} />
      )}
      <form className="armar-partida" onSubmit={jugar}>
        {/* botones grandes en vez de un select: se ve todo de un vistazo y se elige con un toque */}
        <p className="rotulo" id="rotulo-categoria">Categoría</p>
        <div className="selector" role="group" aria-labelledby="rotulo-categoria">
          {lista.map((c) => (
            <button key={c} type="button" aria-pressed={c === categoriaJuego} onClick={() => setCategoria(c)}>
              {c}
            </button>
          ))}
        </div>

        <p className="rotulo" id="rotulo-cantidad">Preguntas</p>
        <div className="selector cantidades" role="group" aria-labelledby="rotulo-cantidad">
          {CANTIDADES.map((n) => (
            <button key={n} type="button" aria-pressed={n === cantidad} onClick={() => setCantidad(n)}>
              {n} preguntas
            </button>
          ))}
        </div>

        <button type="submit" className="boton-jugar" disabled={lista.length === 0 || creando}>
          {creando ? "Preparando..." : "¡A jugar!"}
        </button>
      </form>

      <h3>Aciertos por categoría</h3>
      {errorPorcentajes && <p className="carga-error">No se pudieron cargar los porcentajes.</p>}
      {!porcentajes && !errorPorcentajes && lista.length > 0 && <Cargando texto="Cargando porcentajes..." />}
      {porcentajes && (
        <ul className="porcentajes">
          {lista.map((c) => {
            const valor = porcentajes[c];
            return (
              <li key={c}>
                <span className="nombre">{c}</span>
                {/* la barra se llena según el porcentaje; si no jugó, queda vacía */}
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
