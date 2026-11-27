import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api.js";
import { useMensaje } from "../hooks/useMensaje.jsx";
import Cargando from "../components/Cargando.jsx";
import Categoria from "../components/Categoria.jsx";
import RelojBolsillo, { estadoTiempo } from "../components/RelojBolsillo.jsx";

const SEGUNDOS_POR_PREGUNTA = 15;
const ESPERA_ENTRE_PREGUNTAS = 2000;

export default function Partida() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mostrarMensaje } = useMensaje();

  const [partida, setPartida] = useState(null);
  const [segundos, setSegundos] = useState(SEGUNDOS_POR_PREGUNTA);
  // true desde que responde hasta que aparece la pregunta siguiente
  const [respondiendo, setRespondiendo] = useState(false);
  // { pregunta, numero, elegida, correcta } de la última respuesta, para pintar los botones
  const [feedback, setFeedback] = useState(null);
  const espera = useRef(null);

  useEffect(() => {
    api
      .get("/partidas/" + id)
      .then((datos) => {
        if (datos.estado === "completada") {
          navigate("/resultados/" + id, { replace: true });
        } else if (datos.estado === "abandonada") {
          navigate("/menu", { replace: true });
        } else {
          setPartida(datos);
        }
      })
      .catch((error) => {
        mostrarMensaje(error.message, "error");
        navigate("/menu", { replace: true });
      });
  }, [id, navigate, mostrarMensaje]);

  // si se sale de la pantalla durante la espera, cancelo el paso a la siguiente pregunta
  useEffect(() => {
    return () => clearTimeout(espera.current);
  }, []);

  // reloj: corre solo mientras se espera una respuesta
  useEffect(() => {
    if (partida === null || respondiendo) {
      return;
    }
    const intervalo = setInterval(() => setSegundos((s) => s - 1), 1000);
    return () => clearInterval(intervalo);
  }, [partida, respondiendo]);

  useEffect(() => {
    if (segundos <= 0 && !respondiendo) {
      responder(null);
    }
  }, [segundos, respondiendo]);

  async function responder(opcion) {
    const pregunta = partida.preguntas[partida.indiceActual];
    const numero = partida.indiceActual + 1;
    setRespondiendo(true);
    try {
      const respuesta = await api.post("/partidas/" + id + "/respuestas", { opcion: opcion });
      setFeedback({ pregunta: pregunta, numero: numero, elegida: respuesta.elegida, correcta: respuesta.correcta });
      setPartida(respuesta.partida);
      espera.current = setTimeout(() => {
        if (respuesta.partida.estado === "completada") {
          navigate("/resultados/" + id);
        } else {
          setFeedback(null);
          setSegundos(SEGUNDOS_POR_PREGUNTA);
          setRespondiendo(false);
        }
      }, ESPERA_ENTRE_PREGUNTAS);
    } catch (error) {
      mostrarMensaje(error.message, "error");
      navigate("/menu");
    }
  }

  async function abandonar() {
    if (!confirm("¿Seguro que querés abandonar? La partida va a quedar como abandonada.")) {
      return;
    }
    clearTimeout(espera.current);
    try {
      await api.patch("/partidas/" + id, { estado: "abandonada" });
      mostrarMensaje("Abandonaste la partida. Quedó registrada como abandonada.");
      navigate("/menu");
    } catch (error) {
      mostrarMensaje(error.message, "error");
    }
  }

  if (partida === null) {
    return <Cargando texto="Preparando la partida..." />;
  }

  // durante la espera sigo mostrando la pregunta que se acaba de responder
  const pregunta = feedback ? feedback.pregunta : partida.preguntas[partida.indiceActual];
  const numero = feedback ? feedback.numero : partida.indiceActual + 1;

  let textoFeedback = "";
  if (feedback) {
    const textoCorrecta = pregunta.opciones[feedback.correcta];
    if (feedback.elegida === null) {
      textoFeedback = "Se terminó el tiempo. La respuesta correcta era: " + textoCorrecta;
    } else if (feedback.elegida === feedback.correcta) {
      textoFeedback = "¡Correcto!";
    } else {
      textoFeedback = "Incorrecto. La respuesta correcta era: " + textoCorrecta;
    }
  }

  function claseDeOpcion(indice) {
    if (!feedback) return "";
    if (indice === feedback.correcta) return "correcta";
    if (indice === feedback.elegida) return "incorrecta";
    return "";
  }

  const alerta = respondiendo ? "" : " tiempo-" + estadoTiempo(segundos);

  return (
    <section className={"pantalla partida" + alerta}>
      <div className="info-partida">
        <span>
          Pregunta {numero} de {partida.preguntas.length}
        </span>
        <span>{partida.puntaje} pts</span>
        <RelojBolsillo segundos={segundos} total={SEGUNDOS_POR_PREGUNTA} />
      </div>
      <Categoria nombre={pregunta.categoria} />
      <h2>{pregunta.enunciado}</h2>
      <div className="opciones">
        {pregunta.opciones.map((texto, indice) => (
          <button
            key={indice}
            type="button"
            className={claseDeOpcion(indice)}
            disabled={respondiendo}
            onClick={() => responder(indice)}
          >
            {texto}
          </button>
        ))}
      </div>
      <p className="feedback">{textoFeedback}</p>
      <button type="button" className="secundario" onClick={abandonar} disabled={partida.estado !== "en curso"}>
        Abandonar partida
      </button>
    </section>
  );
}
