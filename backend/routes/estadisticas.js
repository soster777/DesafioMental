import { Router } from "express";
import * as partidasData from "../data/partidas.js";
import * as usuariosData from "../data/usuarios.js";
import { requiereSesion } from "../middlewares/sesion.js";
import {
    partidasDelUsuario,
    soloFinalizadas,
    estadisticasPersonales,
    porcentajePorCategoria,
    ranking,
} from "../logica/estadisticas.js";

const router = Router();

// Request -> [Partida]
async function misPartidas(req) {
    return soloFinalizadas(partidasDelUsuario(await partidasData.obtenerTodas(), req.usuario.usuario));
}

router.get("/estadisticas", requiereSesion, async (req, res) => {
    res.json(estadisticasPersonales(await misPartidas(req)));
});

router.get("/estadisticas/:categoria", requiereSesion, async (req, res) => {
    const categoria = req.params.categoria;
    res.json({ categoria: categoria, porcentaje: porcentajePorCategoria(await misPartidas(req), categoria) });
});

// GET /api/ranking -> ranking general; GET /api/ranking?categoria=Historia -> solo esa categoría
router.get("/ranking", requiereSesion, async (req, res) => {
    const categoria = req.query.categoria;
    // las partidas de prueba de los admins no compiten
    const admins = (await usuariosData.obtenerTodos()).filter((u) => u.rol === "admin").map((u) => u.usuario);
    let partidas = (await partidasData.obtenerTodas()).filter((p) => !admins.includes(p.usuario));
    if (categoria) {
        partidas = partidas.filter((p) => p.categoria === categoria);
    }
    const top = ranking(partidas).map((p) => ({
        id: p.id,
        usuario: p.usuario,
        puntaje: p.puntaje,
        categoria: p.categoria,
        duracion: p.duracion,
        fin: p.fin,
    }));
    res.json(top);
});

export default router;
