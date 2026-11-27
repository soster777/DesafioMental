import * as authService from "../services/auth.services.js";
import * as usuariosService from "../services/usuarios.services.js";

export const listarUsuarios = async (req, res, next) => {
    try {
        await authService.obtenerAdminDeSesion(req.get("Authorization"));
        const usuarios = await usuariosService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
};

export const modificarRol = async (req, res, next) => {
    try {
        const admin = await authService.obtenerAdminDeSesion(req.get("Authorization"));
        const usuario = await usuariosService.cambiarRol(req.params.id, (req.body || {}).rol, admin);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

export const borrarUsuario = async (req, res, next) => {
    try {
        const admin = await authService.obtenerAdminDeSesion(req.get("Authorization"));
        await usuariosService.eliminarUsuario(req.params.id, admin);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
