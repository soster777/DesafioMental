// Number -> String
export function formatearDuracion(milisegundos) {
  const segundos = Math.round(milisegundos / 1000);
  return Math.floor(segundos / 60) + " min " + (segundos % 60) + " s";
}

// Number -> String
export function formatearFecha(milisegundos) {
  return new Date(milisegundos).toLocaleString("es-AR");
}

// Partida -> Number
export function porcentajeDePartida(partida) {
  return Math.round((partida.correctas / partida.preguntas.length) * 100);
}

// Number -> String
export function mensajeSegunPorcentaje(porcentaje) {
  if (porcentaje < 40) {
    return "Necesitás seguir practicando";
  }
  if (porcentaje < 70) {
    return "Vas por buen camino";
  }
  if (porcentaje < 100) {
    return "¡Excelente desempeño!";
  }
  return "¡Partida perfecta!";
}
