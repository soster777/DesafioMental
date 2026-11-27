import * as authService from "../services/auth.services.js";
import * as estadisticasService from "../services/estadisticas.services.js";

export const mostrarEstadisticas = async (req, res, next) => {
    try {
        const usuario = await authService.obtenerUsuarioDeSesion(req.get("Authorization"));
        const estadisticas = await estadisticasService.obtenerEstadisticas(usuario);
        res.status(200).json(estadisticas);
    } catch (error) {
        next(error);
    }
};

export const mostrarPorcentaje = async (req, res, next) => {
    try {
        const usuario = await authService.obtenerUsuarioDeSesion(req.get("Authorization"));
        const porcentaje = await estadisticasService.obtenerPorcentaje(usuario, req.params.categoria);
        res.status(200).json(porcentaje);
    } catch (error) {
        next(error);
    }
};

export const mostrarRanking = async (req, res, next) => {
    try {
        await authService.obtenerUsuarioDeSesion(req.get("Authorization"));
        const ranking = await estadisticasService.obtenerRanking(req.query.categoria);
        res.status(200).json(ranking);
    } catch (error) {
        next(error);
    }
};
