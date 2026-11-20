import { useEffect, useState } from "react";
import { Galera } from "./Recortes.jsx";

// frases que se le atribuyen a Houdini (traducidas), cada una con un remate para el juego
const FRASES = [
  { cita: "Mi cerebro es la llave que libera mi mente.", remate: "¿Te animás a escapar de estas preguntas?" },
  { cita: "Lo que los ojos ven y los oídos oyen, la mente lo cree.", remate: "Pensalo dos veces antes de responder." },
  { cita: "Ninguna prisión puede retenerme.", remate: "Cada acierto es una cerradura menos." },
];
const CADA_CUANTO = 8000; // milisegundos entre frase y frase

// la pantalla que lo usa necesita la clase "con-houdini"
export default function Houdini() {
  const [sinFoto, setSinFoto] = useState(false);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => setIndice((i) => (i + 1) % FRASES.length), CADA_CUANTO);
    return () => clearInterval(intervalo);
  }, []);

  const frase = FRASES[indice];

  return (
    <div className="houdini">
      <figure className="houdini-marco">
        {sinFoto ? (
          <div className="houdini-reemplazo"><Galera /></div>
        ) : (
          <img src="/img/houdini.png" alt="Harry Houdini esposado, foto de 1918" onError={() => setSinFoto(true)} />
        )}
        <figcaption>El gran Houdini</figcaption>
      </figure>
      <blockquote className="globo">
        {/* con una key nueva se repite la animación */}
        <div key={indice} className="globo-texto">
          <p>“{frase.cita}”</p>
          <cite>{frase.remate}</cite>
        </div>
      </blockquote>
    </div>
  );
}
