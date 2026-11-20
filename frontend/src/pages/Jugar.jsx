import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useApp } from "../context/AppContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";
import Ruleta from "../components/Ruleta.jsx";
import { colorDeCategoria } from "../components/Categoria.jsx";

const CANTIDADES = [5, 10];

export default function Jugar() {
  const { usuario, mostrarMensaje } = useApp();
  const esAdmin = usuario.rol === "admin";
  const navigate = useNavigate();
  const categorias = useDatos("/preguntas/categorias");

  const [categoria, setCategoria] = useState("");
  const [cantidad, setCantidad] = useState(5);
  const [creando, setCreando] = useState(false);

  // mientras no elija nada, uso la primera categoría que llegó del servidor
  const lista = categorias.datos || [];
  const categoriaJuego = categoria || lista[0] || "";

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
    <section className="pantalla jugar">
      <h2>{esAdmin ? "Probar partida" : "Elegí tu función"}</h2>
      {esAdmin && <p className="aviso-prueba">Tus partidas de prueba no aparecen en el ranking.</p>}
      {categorias.cargando && <Cargando texto="Cargando categorías..." />}
      {categorias.error && (
        <ErrorCarga texto="No se pudieron cargar las categorías." onReintentar={categorias.recargar} />
      )}

      <div className="jugar-columnas">
        <Ruleta
          categorias={lista}
          onElegir={(c) => {
            setCategoria(c);
            mostrarMensaje("¡La suerte eligió " + c + "!", "exito");
          }}
        />

        <form className="armar-partida" onSubmit={jugar}>
          <p className="rotulo" id="rotulo-categoria">Categoría</p>
          <div className="selector categorias" role="group" aria-labelledby="rotulo-categoria">
            {lista.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={c === categoriaJuego}
                onClick={() => setCategoria(c)}
                style={{ "--color-categoria": colorDeCategoria(c).borde }}
              >
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
            {creando ? "Preparando..." : esAdmin ? "Probar partida" : "¡A jugar!"}
          </button>
        </form>
      </div>
    </section>
  );
}
