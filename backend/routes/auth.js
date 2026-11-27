import crypto from "node:crypto";
import { Router } from "express";
import * as usuariosData from "../data/usuarios.js";
import * as sesionesData from "../data/sesiones.js";
import { requiereSesion } from "../middlewares/sesion.js";
import {
    comoTexto,
    validarRegistro,
    buscarRepetidos,
    buscarPorNombre,
    hashearClave,
    claveCorrecta,
    datosPublicos,
} from "../logica/usuarios.js";

const router = Router();

router.post("/registro", async (req, res) => {
    const cuerpo = req.body || {};
    const datos = {
        usuario: comoTexto(cuerpo.usuario).trim(),
        email: comoTexto(cuerpo.email).trim(),
        clave: comoTexto(cuerpo.clave),
        confirmacion: comoTexto(cuerpo.confirmacion),
    };

    const errores = validarRegistro(datos);
    if (errores.length > 0) {
        return res.status(400).json({ error: "Revisá los datos del registro.", errores: errores });
    }
    const usuarios = await usuariosData.obtenerTodos();
    const repetidos = buscarRepetidos(usuarios, datos);
    if (repetidos.length > 0) {
        return res.status(409).json({ error: "El usuario o el correo ya están registrados.", errores: repetidos });
    }

    const nuevo = {
        id: await usuariosData.obtenerProximoId(),
        usuario: datos.usuario,
        email: datos.email,
        clave: hashearClave(datos.clave),
        rol: "usuario",
    };
    await usuariosData.crear(nuevo);
    res.status(201).json(datosPublicos(nuevo));
});

router.post("/login", async (req, res) => {
    const cuerpo = req.body || {};
    const usuario = buscarPorNombre(await usuariosData.obtenerTodos(), comoTexto(cuerpo.usuario));
    if (usuario === undefined || !claveCorrecta(comoTexto(cuerpo.clave), usuario.clave)) {
        return res.status(401).json({ error: "Los datos ingresados son incorrectos." });
    }

    const token = crypto.randomUUID();
    await sesionesData.crear(token, usuario.usuario);
    res.json({ token: token, usuario: datosPublicos(usuario) });
});

// sirve para recuperar la sesión cuando se recarga la página
router.get("/yo", requiereSesion, (req, res) => {
    res.json(datosPublicos(req.usuario));
});

router.post("/logout", requiereSesion, async (req, res) => {
    await sesionesData.eliminar(req.token);
    res.status(204).end();
});

export default router;
