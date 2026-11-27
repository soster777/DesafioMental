import * as authService from "../services/auth.services.js";
import * as partidasService from "../services/partidas.services.js";

export const listarHistorial = async (req, res, next) => {
    try {
        const usuario = await authService.obtenerUsuarioDeSesion(req.get("Authorization"));
        const historial = await partidasService.obtenerHistorial(usuario, req.query);
        res.status(200).json(historial);
    } catch (error) {
        next(error);
    }
};

export const empezarPartida = async (req, res, next) => {
    try {
        const usuario = await authService.obtenerUsuarioDeSesion(req.get("Authorization"));
        const partida = await partidasService.iniciarPartida(usuario, req.body || {});
        res.status(201).json(partida);
    } catch (error) {
        next(error);
    }
};

export const buscarPartida = async (req, res, next) => {
    try {
        const usuario = await authService.obtenerUsuarioDeSesion(req.get("Authorization"));
        const partida = await partidasService.obtenerPartida(req.params.id, usuario);
        res.status(200).json(partida);
    } catch (error) {
        next(error);
    }
};

export const responder = async (req, res, next) => {
    try {
        const usuario = await authService.obtenerUsuarioDeSesion(req.get("Authorization"));
        const resultado = await partidasService.responderPregunta(req.params.id, usuario, req.body || {});
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const abandonar = async (req, res, next) => {
    try {
        const usuario = await authService.obtenerUsuarioDeSesion(req.get("Authorization"));
        const partida = await partidasService.abandonarPartida(req.params.id, usuario, req.body || {});
        res.status(200).json(partida);
    } catch (error) {
        next(error);
    }
};
