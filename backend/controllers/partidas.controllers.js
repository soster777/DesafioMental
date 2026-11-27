import * as partidasService from "../services/partidas.services.js";

export const listarHistorial = async (req, res, next) => {
    try {
        const historial = await partidasService.obtenerHistorial(req.usuario, req.query);
        res.status(200).json(historial);
    } catch (error) {
        next(error);
    }
};

export const empezarPartida = async (req, res, next) => {
    try {
        const partida = await partidasService.iniciarPartida(req.usuario, req.body || {});
        res.status(201).json(partida);
    } catch (error) {
        next(error);
    }
};

export const buscarPartida = async (req, res, next) => {
    try {
        const partida = await partidasService.obtenerPartida(req.params.id, req.usuario);
        res.status(200).json(partida);
    } catch (error) {
        next(error);
    }
};

export const responder = async (req, res, next) => {
    try {
        const resultado = await partidasService.responderPregunta(req.params.id, req.usuario, req.body || {});
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
};

export const abandonar = async (req, res, next) => {
    try {
        const partida = await partidasService.abandonarPartida(req.params.id, req.usuario, req.body || {});
        res.status(200).json(partida);
    } catch (error) {
        next(error);
    }
};
