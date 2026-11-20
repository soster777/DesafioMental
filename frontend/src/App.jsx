import { Navigate, Route, Routes } from "react-router-dom";
import { useApp } from "./context/AppContext.jsx";
import Barra from "./components/Barra.jsx";
import Mensaje from "./components/Mensaje.jsx";
import Cargando from "./components/Cargando.jsx";
import RutaPrivada from "./components/RutaPrivada.jsx";
import Login from "./pages/Login.jsx";
import Registro from "./pages/Registro.jsx";
import Menu from "./pages/Menu.jsx";
import Partida from "./pages/Partida.jsx";
import Jugar from "./pages/Jugar.jsx";
import Resultados from "./pages/Resultados.jsx";
import Historial from "./pages/Historial.jsx";
import Ranking from "./pages/Ranking.jsx";
import AdminPreguntas from "./pages/AdminPreguntas.jsx";
import AdminUsuarios from "./pages/AdminUsuarios.jsx";
import NoEncontrada from "./pages/NoEncontrada.jsx";
import Recortes from "./components/Recortes.jsx";

export default function App() {
  const { usuario, cargandoSesion } = useApp();

  // hasta saber si hay sesión no muestro rutas, así no rebota al login por un instante
  if (cargandoSesion) {
    return (
      <>
        <Barra />
        <main>
          <Cargando texto="Recuperando sesión..." />
        </main>
      </>
    );
  }

  const inicio = usuario ? "/menu" : "/login";

  return (
    <>
      <Recortes />
      <Barra />
      <Mensaje />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to={inicio} replace />} />
          <Route path="/login" element={usuario ? <Navigate to="/menu" replace /> : <Login />} />
          <Route path="/registro" element={usuario ? <Navigate to="/menu" replace /> : <Registro />} />
          <Route path="/menu" element={<RutaPrivada><Menu /></RutaPrivada>} />
          <Route path="/jugar" element={<RutaPrivada><Jugar /></RutaPrivada>} />
          <Route path="/partida/:id" element={<RutaPrivada><Partida /></RutaPrivada>} />
          <Route path="/resultados/:id" element={<RutaPrivada><Resultados /></RutaPrivada>} />
          <Route
            path="/historial"
            element={<RutaPrivada>{usuario && usuario.rol === "admin" ? <Navigate to="/menu" replace /> : <Historial />}</RutaPrivada>}
          />
          <Route path="/ranking" element={<RutaPrivada><Ranking /></RutaPrivada>} />
          <Route path="/admin/preguntas" element={<RutaPrivada soloAdmin><AdminPreguntas /></RutaPrivada>} />
          <Route path="/admin/usuarios" element={<RutaPrivada soloAdmin><AdminUsuarios /></RutaPrivada>} />
          <Route path="*" element={<NoEncontrada />} />
        </Routes>
      </main>
    </>
  );
}
