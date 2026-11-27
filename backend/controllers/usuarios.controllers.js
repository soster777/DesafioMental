import * as usuariosService from "../services/usuarios.services.js";

export const listarUsuarios = async (req, res, next) => {
    try {
        const usuarios = await usuariosService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        next(error);
    }
};

export const modificarRol = async (req, res, next) => {
    try {
        const usuario = await usuariosService.cambiarRol(req.params.id, (req.body || {}).rol, req.usuario);
        res.status(200).json(usuario);
    } catch (error) {
        next(error);
    }
};

export const borrarUsuario = async (req, res, next) => {
    try {
        await usuariosService.eliminarUsuario(req.params.id, req.usuario);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
};
