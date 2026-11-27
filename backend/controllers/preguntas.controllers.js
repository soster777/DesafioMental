import * as authService from "../services/auth.services.js";
import * as preguntasService from "../services/preguntas.services.js";

// cualquier usuario logueado necesita las categorías para jugar y filtrar
export const listarCategorias = async (req, res, next) => {
    try {
        await authService.obtenerUsuarioDeSesion(req.get("Authorization"));
        const categorias = await preguntasService.obtenerCategorias();
        res.status(200).json(categorias);
    } catch (error) {
        next(error);
    }
};

export const listarPreguntas = async (req, res, next) => {
    try {
        await authService.obtenerAdminDeSesion(req.get("Authorization"));
        const preguntas = await preguntasService.obtenerPreguntas();
        res.status(200).json(preguntas);
    } catch (error) {
        next(error);
    }
};

export const registrarPregunta = async (req, res, next) => {
    try {
        await authService.obtenerAdminDeSesion(req.get("Authorization"));
        const pregunta = await preguntasService.crearPregunta(req.body || {});
        res.status(201).json(pregunta);
    } catch (error) {
        next(error);
    }
};

export const modificarPregunta = async (req, res, next) => {
    try {
        await authService.obtenerAdminDeSesion(req.get("Authorization"));
        const pregunta = await preguntasService.actualizarPregunta(req.params.id, req.body || {});
        res.status(200).json(pregunta);
    } catch (error) {
        next(error);
    }
};

export const borrarPregunta = async (req, res, next) => {
    try {
        await authService.obtenerAdminDeSesion(req.get("Authorization"));
        await preguntasService.eliminarPregunta(req.params.id);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
