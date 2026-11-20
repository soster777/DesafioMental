import express from "express";
import path from "node:path";
import { inicializarDatos } from "./datos.js";
import authRoutes from "./routes/auth.js";
import preguntasRoutes from "./routes/preguntas.js";
import partidasRoutes from "./routes/partidas.js";
import estadisticasRoutes from "./routes/estadisticas.js";
import usuariosRoutes from "./routes/usuarios.js";

const PUERTO = process.env.PORT || 3000;
const app = express();

inicializarDatos();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/preguntas", preguntasRoutes);
app.use("/api/partidas", partidasRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api", estadisticasRoutes);

// en producción el mismo servidor entrega el frontend ya compilado
const FRONTEND = path.join(import.meta.dirname, "..", "frontend", "dist");
app.use(express.static(FRONTEND));
app.use((req, res, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    // las rutas de React Router no son archivos, así que siempre devuelvo index.html
    res.sendFile(path.join(FRONTEND, "index.html"), (err) => err && next());
});

// si ninguna ruta respondió, no existe
app.use((req, res) => {
    res.status(404).json({ error: "No existe la ruta " + req.method + " " + req.originalUrl + "." });
});

// Express reconoce el middleware de errores porque tiene 4 parámetros
app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido." });
    }
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor." });
});

app.listen(PUERTO, () => {
    console.log("API de Desafío Mental en http://localhost:" + PUERTO);
});
