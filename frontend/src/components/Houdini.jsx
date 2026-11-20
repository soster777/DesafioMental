import { useEffect, useState } from "react";
import { Galera } from "./Recortes.jsx";

// frases que se le atribuyen a Houdini (traducidas), cada una con un remate para el juego
const FRASES = [
  { cita: "Mi cerebro es la llave que libera mi mente.", remate: "¿Te animás a escapar de estas preguntas?" },
  { cita: "Lo que los ojos ven y los oídos oyen, la mente lo cree.", remate: "Pensalo dos veces antes de responder." },
  { cita: "Ninguna prisión puede retenerme.", remate: "Cada acierto es una cerradura menos." },
];
const CADA_CUANTO = 8000; // milisegundos entre frase y frase

// Recorte de Houdini colgado de la esquina del cartel, con un globito de diálogo que va cambiando.
// La foto (dominio público, 1918) está en public/img/houdini.png: lo que va en public/ Vite lo sirve tal cual desde la raíz.
// La pantalla que lo use tiene que llevar la clase "con-houdini" para dejarle lugar a la derecha.
export default function Houdini() {
  const [sinFoto, setSinFoto] = useState(false);
  const [indice, setIndice] = useState(0);

  // cada CADA_CUANTO paso a la frase siguiente; el % hace que después de la última vuelva a la primera
  useEffect(() => {
    const intervalo = setInterval(() => setIndice((i) => (i + 1) % FRASES.length), CADA_CUANTO);
    // al salir de la pantalla corto el intervalo, si no quedaría corriendo
    return () => clearInterval(intervalo);
  }, []);

  const frase = FRASES[indice];

  return (
    <div className="houdini">
      <figure className="houdini-marco">
        {sinFoto ? (
          // si la foto no está, muestro la galera para que el marco no quede vacío
          <div className="houdini-reemplazo"><Galera /></div>
        ) : (
          <img src="/img/houdini.png" alt="Harry Houdini esposado, foto de 1918" onError={() => setSinFoto(true)} />
        )}
        <figcaption>El gran Houdini</figcaption>
      </figure>
      <blockquote className="globo">
        {/* la key cambia con la frase: React vuelve a crear el div y así se repite la animación de entrada */}
        <div key={indice} className="globo-texto">
          <p>“{frase.cita}”</p>
          <cite>{frase.remate}</cite>
        </div>
      </blockquote>
    </div>
  );
}
