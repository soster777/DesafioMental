import { Router } from "express";
import { requiereSesion, soloAdmin } from "../middlewares/sesion.js";
import * as usuariosService from "../services/usuarios.services.js";

const router = Router();

router.use(requiereSesion, soloAdmin);

router.get("/", async (req, res, next) => {
    try {
        res.json(await usuariosService.listarUsuarios());
    } catch (error) {
        next(error);
    }
});

router.put("/:id/rol", async (req, res, next) => {
    try {
        res.json(await usuariosService.cambiarRol(req.params.id, (req.body || {}).rol, req.usuario));
    } catch (error) {
        next(error);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        await usuariosService.eliminarUsuario(req.params.id, req.usuario);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

export default router;
