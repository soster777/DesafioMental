// colores fijos para las categorías que vienen de fábrica
const COLORES_FIJOS = {
  Historia: { fondo: "#fdf0c4", texto: "#8a6200", borde: "#d4a017" },
  Ciencia: { fondo: "#d6e8fd", texto: "#11528f", borde: "#3d6fb0" },
  Geografía: { fondo: "#d4f5e2", texto: "#0f6b3a", borde: "#3d8b4f" },
  Deportes: { fondo: "#fde0dc", texto: "#a3271b", borde: "#c0392b" },
  Mezcladas: { fondo: "#1c2333", texto: "#e8c35a", borde: "#1c2333" },
};

// para las categorías que cree el admin
const COLORES_EXTRA = [
  { fondo: "#ecdcfd", texto: "#5b2a99", borde: "#7b4bc0" },
  { fondo: "#fbdcef", texto: "#9a1f68", borde: "#c0397f" },
  { fondo: "#d5f3f3", texto: "#11696b", borde: "#2a9a9c" },
  { fondo: "#e9ecd2", texto: "#5b6312", borde: "#8a9420" },
];

// String -> { fondo, texto, borde }
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
