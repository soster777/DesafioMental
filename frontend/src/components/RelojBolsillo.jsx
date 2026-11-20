const CX = 60; // centro de la esfera
const CY = 82;
const R = 42; // radio de la esfera
const MARCAS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// también lo usa Partida para los bordes
export function estadoTiempo(segundos) {
  if (segundos <= 5) return "urgente";
  if (segundos <= 10) return "aviso";
  return "normal";
}

// ángulo (0 = arriba, sentido horario) -> punto sobre el borde de la esfera
function punto(angulo) {
  return [CX + R * Math.sin(angulo), CY - R * Math.cos(angulo)];
}

export default function RelojBolsillo({ segundos, total }) {
  const quedan = Math.max(segundos, 0);
  const fraccion = quedan / total;
  const transcurrido = (1 - fraccion) * 2 * Math.PI;
  const estado = estadoTiempo(quedan);

  const [x, y] = punto(transcurrido);
  const arcoGrande = fraccion > 0.5 ? 1 : 0;
  const gajo = `M${CX} ${CY} L${x} ${y} A${R} ${R} 0 ${arcoGrande} 1 ${CX} ${CY - R} Z`;

  return (
    <div className={"reloj " + estado} role="timer" aria-label={"Quedan " + quedan + " segundos"}>
      <svg viewBox="0 0 120 130">
        <circle cx="60" cy="12" r="9" fill="none" stroke="#b8862a" strokeWidth="5" />
        <rect x="51" y="22" width="18" height="14" rx="3" fill="#d9a53a" stroke="#8a6a1c" strokeWidth="2" />
        <circle cx={CX} cy={CY} r="52" fill="#d9a53a" stroke="#8a6a1c" strokeWidth="3" />
        <circle cx={CX} cy={CY} r="47" fill="none" stroke="#f5d77a" strokeWidth="2" />
        <circle cx={CX} cy={CY} r={R} fill="#fbf5e6" stroke="#8a6a1c" strokeWidth="2" />
        {/* un arco que empieza y termina en el mismo punto no se dibuja */}
        {fraccion >= 1 ? (
          <circle cx={CX} cy={CY} r={R} className="reloj-gajo" />
        ) : (
          fraccion > 0 && <path d={gajo} className="reloj-gajo" />
        )}
        {MARCAS.map((i) => (
          <line
            key={i}
            x1={CX} y1={CY - R + 3} x2={CX} y2={CY - R + (i % 3 === 0 ? 11 : 7)}
            stroke="#3a2a10" strokeWidth={i % 3 === 0 ? 3 : 1.5}
            transform={`rotate(${i * 30} ${CX} ${CY})`}
          />
        ))}
        <text x={CX} y={CY + 22} textAnchor="middle" dominantBaseline="central" className="reloj-numero">
          {quedan}
        </text>
        <line
          x1={CX} y1={CY + 6} x2={CX} y2={CY - R + 8}
          className="reloj-aguja"
          style={{ transform: `rotate(${(1 - fraccion) * 360}deg)`, transformOrigin: `${CX}px ${CY}px` }}
        />
        <circle cx={CX} cy={CY} r="4" fill="#3a2a10" />
      </svg>
    </div>
  );
}
