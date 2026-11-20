import { Router } from "express";
import { leer } from "../datos.js";
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
function misPartidas(req) {
    return soloFinalizadas(partidasDelUsuario(leer("partidas"), req.usuario.usuario));
}

router.get("/estadisticas", requiereSesion, (req, res) => {
    res.json(estadisticasPersonales(misPartidas(req)));
});

router.get("/estadisticas/:categoria", requiereSesion, (req, res) => {
    const categoria = req.params.categoria;
    res.json({ categoria: categoria, porcentaje: porcentajePorCategoria(misPartidas(req), categoria) });
});

// GET /api/ranking -> ranking general; GET /api/ranking?categoria=Historia -> solo esa categoría
router.get("/ranking", requiereSesion, (req, res) => {
    const categoria = req.query.categoria;
    // las partidas de prueba de los admins no compiten
    const admins = leer("usuarios").filter((u) => u.rol === "admin").map((u) => u.usuario);
    let partidas = leer("partidas").filter((p) => !admins.includes(p.usuario));
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
