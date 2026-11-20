export function Llave() {
  return (
    <svg viewBox="0 0 120 60">
      <path fillRule="evenodd" d="M25 8a22 22 0 1 0 .01 0zM25 21a9 9 0 1 1-.01 0z" fill="#d9a53a" stroke="#7a5512" strokeWidth="2" />
      <rect x="45" y="25" width="70" height="10" rx="2" fill="#d9a53a" stroke="#7a5512" strokeWidth="2" />
      <rect x="88" y="34" width="8" height="14" fill="#d9a53a" stroke="#7a5512" strokeWidth="2" />
      <rect x="102" y="34" width="8" height="10" fill="#d9a53a" stroke="#7a5512" strokeWidth="2" />
    </svg>
  );
}

export function Candado() {
  return (
    <svg viewBox="0 0 100 100">
      <path d="M30 46V30a20 20 0 0 1 40 0v16" fill="none" stroke="#9aa3ad" strokeWidth="9" />
      <rect x="18" y="42" width="64" height="52" rx="7" fill="#d9a53a" stroke="#7a5512" strokeWidth="3" />
      <circle cx="50" cy="62" r="7" fill="#3a2a10" />
      <path d="M46 64h8l3 16H43z" fill="#3a2a10" />
    </svg>
  );
}

export function Esposas() {
  return (
    <svg viewBox="0 0 140 80">
      <circle cx="32" cy="44" r="24" fill="none" stroke="#7d9bb8" strokeWidth="9" />
      <circle cx="108" cy="44" r="24" fill="none" stroke="#7d9bb8" strokeWidth="9" />
      <rect x="22" y="12" width="20" height="12" rx="3" fill="#5c7891" />
      <rect x="98" y="12" width="20" height="12" rx="3" fill="#5c7891" />
      {/* eslabones de la cadena */}
      <ellipse cx="58" cy="18" rx="8" ry="5" fill="none" stroke="#5c7891" strokeWidth="4" />
      <ellipse cx="70" cy="18" rx="8" ry="5" fill="none" stroke="#5c7891" strokeWidth="4" />
      <ellipse cx="82" cy="18" rx="8" ry="5" fill="none" stroke="#5c7891" strokeWidth="4" />
    </svg>
  );
}

export function Lamparita() {
  return (
    <svg viewBox="0 0 100 110">
      <g stroke="#e8b923" strokeWidth="4" strokeLinecap="round">
        <line x1="50" y1="2" x2="50" y2="14" />
        <line x1="14" y1="16" x2="22" y2="25" />
        <line x1="86" y1="16" x2="78" y2="25" />
        <line x1="2" y1="48" x2="14" y2="48" />
        <line x1="98" y1="48" x2="86" y2="48" />
      </g>
      <path d="M50 20a28 28 0 0 0-16 51v9h32v-9a28 28 0 0 0-16-51z" fill="#ffe27a" stroke="#c99a10" strokeWidth="3" />
      <rect x="35" y="82" width="30" height="8" fill="#9aa3ad" />
      <rect x="37" y="90" width="26" height="8" fill="#7f8891" />
      <rect x="42" y="98" width="16" height="6" rx="3" fill="#5f666d" />
    </svg>
  );
}

export function Lupa() {
  return (
    <svg viewBox="0 0 100 120">
      <rect x="56" y="70" width="16" height="48" rx="6" fill="#a0612c" stroke="#5e3612" strokeWidth="3" transform="rotate(-35 64 94)" />
      <circle cx="42" cy="42" r="32" fill="#cfe6f2" fillOpacity="0.85" stroke="#8a9199" strokeWidth="8" />
      <path d="M26 30a20 20 0 0 1 14-10" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export function Galera() {
  return (
    <svg viewBox="0 0 100 90">
      <ellipse cx="50" cy="78" rx="46" ry="9" fill="#1b1b1f" />
      <path d="M24 78V18q0-8 26-8t26 8v60z" fill="#232329" />
      <rect x="24" y="58" width="52" height="12" fill="#9e1b1b" />
      <ellipse cx="50" cy="16" rx="26" ry="6" fill="#33333b" />
    </svg>
  );
}

export function Carta() {
  return (
    <svg viewBox="0 0 70 100">
      <rect x="3" y="3" width="64" height="94" rx="7" fill="#fbf5e6" stroke="#2a2a2a" strokeWidth="2" />
      <text x="10" y="24" fontFamily="Georgia, serif" fontSize="18" fontWeight="700" fill="#b3261e">A</text>
      <path d="M35 40c-6-10-20-4-14 8l14 16 14-16c6-12-8-18-14-8z" fill="#b3261e" />
      <text x="60" y="88" fontFamily="Georgia, serif" fontSize="18" fontWeight="700" fill="#b3261e" textAnchor="end">A</text>
    </svg>
  );
}

export function Estrella({ color = "#b3261e" }) {
  return (
    <svg viewBox="0 0 100 100">
      <polygon points="50,4 61,38 97,38 68,59 79,94 50,73 21,94 32,59 3,38 39,38" fill={color} />
    </svg>
  );
}

export function Corona() {
  return (
    <svg viewBox="0 0 100 80">
      <path d="M8 70L4 18l26 22L50 6l20 34 26-22-4 52z" fill="#f2c33b" stroke="#8a6a1c" strokeWidth="3" strokeLinejoin="round" />
      <rect x="8" y="64" width="84" height="12" rx="3" fill="#d9a53a" stroke="#8a6a1c" strokeWidth="3" />
      <circle cx="50" cy="48" r="6" fill="#b3261e" />
      <circle cx="28" cy="54" r="4" fill="#2a5aa0" />
      <circle cx="72" cy="54" r="4" fill="#2a5aa0" />
    </svg>
  );
}

export function Medalla({ metal, texto }) {
  return (
    <svg viewBox="0 0 80 110">
      <path d="M18 2h18l10 40H28z" fill="#9e1b1b" />
      <path d="M62 2H44L34 42h18z" fill="#1c2333" />
      <circle cx="40" cy="70" r="30" fill={metal.claro} stroke={metal.oscuro} strokeWidth="5" />
      <circle cx="40" cy="70" r="20" fill="none" stroke={metal.oscuro} strokeWidth="2" strokeDasharray="3 3" />
      <text x="40" y="71" textAnchor="middle" dominantBaseline="central" fontFamily="Georgia, serif" fontSize="28" fontWeight="700" fill={metal.oscuro}>{texto}</text>
    </svg>
  );
}

const DECORADO = [
  { Dibujo: Lamparita, clase: "izq", top: "14%", lado: "4%", ancho: 96, giro: -12 },
  { Dibujo: Esposas, clase: "izq", top: "40%", lado: "2%", ancho: 130, giro: 10 },
  { Dibujo: Carta, clase: "izq", top: "66%", lado: "6%", ancho: 70, giro: -18 },
  { Dibujo: Estrella, clase: "izq", top: "88%", lado: "3%", ancho: 46, giro: 0 },
  { Dibujo: Llave, clase: "der", top: "12%", lado: "3%", ancho: 130, giro: -25 },
  { Dibujo: Candado, clase: "der", top: "36%", lado: "5%", ancho: 90, giro: 12 },
  { Dibujo: Lupa, clase: "der", top: "60%", lado: "4%", ancho: 96, giro: -20 },
  { Dibujo: Galera, clase: "der", top: "84%", lado: "6%", ancho: 90, giro: 8 },
];

export default function Recortes() {
  return (
    <div className="recortes" aria-hidden="true">
      {DECORADO.map(({ Dibujo, clase, top, lado, ancho, giro }, i) => (
        <div
          key={i}
          className={"recorte " + clase}
          style={{
            top: top,
            [clase === "izq" ? "left" : "right"]: lado,
            width: ancho,
            "--giro": giro + "deg",
          }}
        >
          <Dibujo />
        </div>
      ))}
    </div>
  );
}
