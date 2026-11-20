// colores fijos para las categorías que vienen de fábrica
const COLORES_FIJOS = {
  Historia: { fondo: "#fdecc8", texto: "#8a4b00" },
  Ciencia: { fondo: "#d4f5e2", texto: "#0f6b3a" },
  Geografía: { fondo: "#d6e8fd", texto: "#11528f" },
  Deportes: { fondo: "#fde0dc", texto: "#a3271b" },
  Mezcladas: { fondo: "#1c2333", texto: "#e8c35a" },
};

// para las categorías que cree el admin
const COLORES_EXTRA = [
  { fondo: "#ecdcfd", texto: "#5b2a99" },
  { fondo: "#fbdcef", texto: "#9a1f68" },
  { fondo: "#d5f3f3", texto: "#11696b" },
  { fondo: "#e9ecd2", texto: "#5b6312" },
];

// String -> { fondo, texto }
export function colorDeCategoria(categoria) {
  if (COLORES_FIJOS[categoria]) {
    return COLORES_FIJOS[categoria];
  }
  // la misma categoría siempre suma lo mismo, así que siempre le toca el mismo color
  const suma = [...categoria].reduce((total, letra) => total + letra.charCodeAt(0), 0);
  return COLORES_EXTRA[suma % COLORES_EXTRA.length];
}

export default function Categoria({ nombre }) {
  const color = colorDeCategoria(nombre);
  return (
    <span className="categoria" style={{ background: color.fondo, color: color.texto }}>
      {nombre}
    </span>
  );
}
