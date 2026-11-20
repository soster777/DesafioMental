import { useState } from "react";
import { api } from "../api.js";
import { useApp } from "../context/AppContext.jsx";
import { useDatos } from "../hooks/useDatos.js";
import Cargando from "../components/Cargando.jsx";
import ErrorCarga from "../components/ErrorCarga.jsx";
import Errores from "../components/Errores.jsx";
import Categoria from "../components/Categoria.jsx";

const FORM_VACIO = { categoria: "", enunciado: "", opciones: ["", "", "", ""], correcta: 0, puntos: 10 };

export default function AdminPreguntas() {
  const { mostrarMensaje } = useApp();
  const preguntas = useDatos("/preguntas");
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState([]);
  const [enviando, setEnviando] = useState(false);

  const lista = preguntas.datos || [];
  // categorías sin repetir: me quedo con cada una solo la primera vez que aparece
  const todas = lista.map((p) => p.categoria);
  const categorias = todas.filter((c, i) => todas.indexOf(c) === i);

  function cambiarOpcion(indice, texto) {
    const opciones = form.opciones.map((opcion, i) => (i === indice ? texto : opcion));
    setForm({ ...form, opciones: opciones });
  }

  function limpiar() {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setErrores([]);
  }

  function editar(pregunta) {
    setForm({
      categoria: pregunta.categoria,
      enunciado: pregunta.enunciado,
      opciones: pregunta.opciones,
      correcta: pregunta.correcta,
      puntos: pregunta.puntos,
    });
    setEditandoId(pregunta.id);
    setErrores([]);
    window.scrollTo(0, 0);
  }

  async function guardar(event) {
    event.preventDefault();
    setEnviando(true);
    try {
      if (editandoId === null) {
        await api.post("/preguntas", form);
        mostrarMensaje("Pregunta creada.", "exito");
      } else {
        await api.put("/preguntas/" + editandoId, form);
        mostrarMensaje("Pregunta actualizada.", "exito");
      }
      limpiar();
      preguntas.recargar();
    } catch (error) {
      setErrores(error.errores.length > 0 ? error.errores : [error.message]);
    }
    setEnviando(false);
  }

  async function eliminar(pregunta) {
    if (!confirm('¿Eliminar la pregunta "' + pregunta.enunciado + '"?')) {
      return;
    }
    try {
      await api.delete("/preguntas/" + pregunta.id);
      mostrarMensaje("Pregunta eliminada.", "exito");
      if (editandoId === pregunta.id) {
        limpiar();
      }
      preguntas.recargar();
    } catch (error) {
      mostrarMensaje(error.message, "error");
    }
  }

  return (
    <>
      <section className="pantalla">
        <h2>{editandoId === null ? "Nueva pregunta" : "Editar pregunta #" + editandoId}</h2>
        <form onSubmit={guardar} noValidate>
          <label>
            Enunciado
            <input type="text" value={form.enunciado} onChange={(e) => setForm({ ...form, enunciado: e.target.value })} />
          </label>
          <label>
            Categoría (elegí una o escribí una nueva)
            <input
              type="text"
              list="lista-categorias"
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            />
            <datalist id="lista-categorias">
              {categorias.map((categoria) => (
                <option key={categoria} value={categoria} />
              ))}
            </datalist>
          </label>
          <div className="opciones-form">
            {form.opciones.map((opcion, indice) => (
              <label key={indice}>
                Opción {indice + 1}
                <input type="text" value={opcion} onChange={(e) => cambiarOpcion(indice, e.target.value)} />
              </label>
            ))}
          </div>
          <div className="fila opciones-form">
            <label>
              Opción correcta
              <select value={form.correcta} onChange={(e) => setForm({ ...form, correcta: Number(e.target.value) })}>
                {form.opciones.map((opcion, indice) => (
                  <option key={indice} value={indice}>
                    {indice + 1}
                    {opcion ? " - " + opcion : ""}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Puntos
              <select value={form.puntos} onChange={(e) => setForm({ ...form, puntos: Number(e.target.value) })}>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>
          <Errores errores={errores} />
          <nav className="acciones">
            <button type="submit" disabled={enviando}>
              {editandoId === null ? "Agregar pregunta" : "Guardar cambios"}
            </button>
            {editandoId !== null && (
              <button type="button" className="secundario" onClick={limpiar}>
                Cancelar
              </button>
            )}
          </nav>
        </form>
      </section>

      <section className="pantalla">
        <h2>Banco de preguntas ({lista.length})</h2>
        {preguntas.cargando && <Cargando texto="Cargando preguntas..." />}
        {preguntas.error && <ErrorCarga texto={preguntas.error} onReintentar={preguntas.recargar} />}
        {lista.length > 0 && (
          <div className="tabla-scroll">
            <table>
              <thead>
                <tr>
                  <th>Enunciado</th>
                  <th>Categoría</th>
                  <th>Pts</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((pregunta) => (
                  <tr key={pregunta.id}>
                    <td>{pregunta.enunciado}</td>
                    <td><Categoria nombre={pregunta.categoria} /></td>
                    <td>{pregunta.puntos}</td>
                    <td>
                      <div className="celda-acciones">
                        <button type="button" onClick={() => editar(pregunta)}>
                          Editar
                        </button>
                        <button type="button" className="secundario" onClick={() => eliminar(pregunta)}>
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
