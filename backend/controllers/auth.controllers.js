import * as authService from "../services/auth.services.js";

export const registrar = async (req, res, next) => {
    try {
        const usuario = await authService.registrarUsuario(req.body || {});
        res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
};

export const login = async (req, res, next) => {
    try {
        const sesion = await authService.iniciarSesion(req.body || {});
        res.status(200).json(sesion);
    } catch (error) {
        next(error);
    }
};

// sirve para recuperar la sesión cuando se recarga la página
export const obtenerSesion = async (req, res, next) => {
    try {
        const usuario = await authService.obtenerSesion(req.get("Authorization"));
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

export const logout = async (req, res, next) => {
    try {
        await authService.cerrarSesion(req.get("Authorization"));
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
