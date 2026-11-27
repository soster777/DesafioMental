import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";

// acceso: "usuario" (cualquiera con sesión), "admin" (solo admin) o "jugador" (con sesión, pero no admin)
export default function RutaPrivada({ acceso, children }) {
  const { usuario } = useAuth();
  if (usuario === null) {
    return <Navigate to="/login" replace />;
  }
  if (acceso === "admin" && usuario.rol !== "admin") {
    return <Navigate to="/menu" replace />;
  }
  if (acceso === "jugador" && usuario.rol === "admin") {
    return <Navigate to="/menu" replace />;
  }
  return children;
}
