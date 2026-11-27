import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext/AuthProvider.jsx";
import { MensajeProvider } from "./context/MensajeContext/MensajeProvider.jsx";
import { useAuth } from "./hooks/useAuth.jsx";
import Barra from "./components/Barra.jsx";
import Mensaje from "./components/Mensaje.jsx";
import Cargando from "./components/Cargando.jsx";
import RutaPrivada from "./components/RutaPrivada.jsx";
import Recortes from "./components/Recortes.jsx";
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

// acceso: "invitado" (solo sin sesión), "usuario", "jugador", "admin" o "publico"
const routes = [
  // en "/" un invitado va al login y uno con sesión al menú
  { id: 1, path: "/", element: <Navigate to="/login" replace />, acceso: "invitado" },
  { id: 2, path: "/login", element: <Login />, acceso: "invitado" },
  { id: 3, path: "/registro", element: <Registro />, acceso: "invitado" },
  { id: 4, path: "/menu", element: <Menu />, acceso: "usuario" },
  { id: 5, path: "/jugar", element: <Jugar />, acceso: "usuario" },
  { id: 6, path: "/partida/:id", element: <Partida />, acceso: "usuario" },
  { id: 7, path: "/resultados/:id", element: <Resultados />, acceso: "usuario" },
  { id: 8, path: "/historial", element: <Historial />, acceso: "jugador" },
  { id: 9, path: "/ranking", element: <Ranking />, acceso: "usuario" },
  { id: 10, path: "/admin/preguntas", element: <AdminPreguntas />, acceso: "admin" },
  { id: 11, path: "/admin/usuarios", element: <AdminUsuarios />, acceso: "admin" },
  { id: 12, path: "*", element: <NoEncontrada />, acceso: "publico" },
];

function Contenido() {
  const { usuario, cargandoSesion } = useAuth();

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

  function proteger(route) {
    if (route.acceso === "publico") {
      return route.element;
    }
    if (route.acceso === "invitado") {
      return usuario ? <Navigate to="/menu" replace /> : route.element;
    }
    return <RutaPrivada acceso={route.acceso}>{route.element}</RutaPrivada>;
  }

  return (
    <>
      <Recortes />
      <Barra />
      <Mensaje />
      <main>
        <Routes>
          {routes.map((route) => (
            <Route key={route.id} path={route.path} element={proteger(route)} />
          ))}
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MensajeProvider>
          <Contenido />
        </MensajeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
