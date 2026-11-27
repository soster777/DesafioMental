import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

// envuelve las páginas que necesitan sesión (y rol admin si se pide)
export default function RutaPrivada({ soloAdmin = false, children }) {
  const { usuario } = useAuth();
  if (usuario === null) {
    return <Navigate to="/login" replace />;
  }
  if (soloAdmin && usuario.rol !== "admin") {
    return <Navigate to="/menu" replace />;
  }
  return children;
}
