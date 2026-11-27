import { Router } from "express";
import { requiereSesion } from "../middlewares/sesion.js";
import * as authService from "../services/auth.services.js";
import { datosPublicos } from "../logica/usuarios.js";

const router = Router();

router.post("/registro", async (req, res, next) => {
    try {
        const usuario = await authService.registrarUsuario(req.body || {});
        res.status(201).json(usuario);
    } catch (error) {
        next(error);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        res.json(await authService.iniciarSesion(req.body || {}));
    } catch (error) {
        next(error);
    }
});

// sirve para recuperar la sesión cuando se recarga la página
router.get("/yo", requiereSesion, (req, res) => {
    res.json(datosPublicos(req.usuario));
});

router.post("/logout", requiereSesion, async (req, res, next) => {
    try {
        await authService.cerrarSesion(req.token);
        res.status(204).end();
    } catch (error) {
        next(error);
    }
});

export default router;
