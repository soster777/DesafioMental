import { Router } from "express";
import * as usuariosData from "../data/usuarios.js";
import * as partidasData from "../data/partidas.js";
import * as sesionesData from "../data/sesiones.js";
import { requiereSesion, soloAdmin } from "../middlewares/sesion.js";
import { datosPublicos } from "../logica/usuarios.js";

const ROLES = ["usuario", "admin"];

const router = Router();

router.use(requiereSesion, soloAdmin);

router.get("/", async (req, res) => {
    const partidas = await partidasData.obtenerTodas();
    const usuarios = (await usuariosData.obtenerTodos()).map((u) => ({
        ...datosPublicos(u),
        // las del admin son de prueba, no cuentan
        partidas: u.rol === "admin" ? null : partidas.filter((p) => p.usuario === u.usuario && p.estado === "completada").length,
    }));
    res.json(usuarios);
});

// Request -> Response -> Usuario | undefined
async function buscarOtro(req, res) {
    const id = Number(req.params.id);
    const usuario = await usuariosData.obtenerPorId(id);
    if (usuario === undefined) {
        res.status(404).json({ error: "No existe el usuario " + req.params.id + "." });
        return undefined;
    }
    // así el admin no se puede dejar afuera a sí mismo
    if (usuario.id === req.usuario.id) {
        res.status(400).json({ error: "No podés modificar tu propia cuenta." });
        return undefined;
    }
    return usuario;
}

router.put("/:id/rol", async (req, res) => {
    const usuario = await buscarOtro(req, res);
    if (usuario === undefined) return;
    const rol = (req.body || {}).rol;
    if (!ROLES.includes(rol)) {
        return res.status(400).json({ error: "El rol tiene que ser usuario o admin." });
    }
    const actualizado = await usuariosData.actualizar(usuario.id, { rol: rol });
    res.json(datosPublicos(actualizado));
});

router.delete("/:id", async (req, res) => {
    const usuario = await buscarOtro(req, res);
    if (usuario === undefined) return;
    await usuariosData.eliminar(usuario.id);
    await partidasData.eliminarDelUsuario(usuario.usuario);
    await sesionesData.eliminarDelUsuario(usuario.usuario);
    res.status(204).end();
});

export default router;
