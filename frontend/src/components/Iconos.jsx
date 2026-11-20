// Íconos de la barra de abajo (celular). Usan currentColor: toman el color del texto,
// así el que está activo se pinta solo con el CSS del link.

export function IconoCarpa() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2v3M3 20L12 5l9 15z" />
      <path d="M12 5l-3 15M12 5l3 15" />
      <path d="M12 2l4 1.5L12 5" fill="currentColor" />
    </svg>
  );
}

export function IconoPergamino() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M6 3h11a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6" />
      <path d="M6 3a2 2 0 0 0-2 2v2h4V5a2 2 0 0 0-2-2zM6 21a2 2 0 0 0 2-2V7" />
      <path d="M11 9h5M11 13h5M11 17h3" />
    </svg>
  );
}

export function IconoTrofeo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
      <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4" />
      <path d="M12 14v4M8 21h8M9 18h6" />
    </svg>
  );
}

export function IconoPregunta() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" />
    </svg>
  );
}
