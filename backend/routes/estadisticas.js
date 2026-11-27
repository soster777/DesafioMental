import { Router } from "express";
import { requiereSesion } from "../middlewares/sesion.js";
import * as estadisticasService from "../services/estadisticas.services.js";

const router = Router();

router.get("/estadisticas", requiereSesion, async (req, res, next) => {
    try {
        res.json(await estadisticasService.obtenerEstadisticas(req.usuario));
    } catch (error) {
        next(error);
    }
});

router.get("/estadisticas/:categoria", requiereSesion, async (req, res, next) => {
    try {
        res.json(await estadisticasService.obtenerPorcentaje(req.usuario, req.params.categoria));
    } catch (error) {
        next(error);
    }
});

// GET /api/ranking -> ranking general; GET /api/ranking?categoria=Historia -> solo esa categoría
router.get("/ranking", requiereSesion, async (req, res, next) => {
    try {
        res.json(await estadisticasService.obtenerRanking(req.query.categoria));
    } catch (error) {
        next(error);
    }
});

export default router;
