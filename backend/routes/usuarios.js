import { Router } from "express";
import { leer, guardar } from "../datos.js";
import { requiereSesion, soloAdmin } from "../middlewares/sesion.js";
import { datosPublicos } from "../logica/usuarios.js";

const ROLES = ["usuario", "admin"];

const router = Router();

router.use(requiereSesion, soloAdmin);

router.get("/", (req, res) => {
    const partidas = leer("partidas");
    const usuarios = leer("usuarios").map((u) => ({
        ...datosPublicos(u),
        partidas: partidas.filter((p) => p.usuario === u.usuario && p.estado === "completada").length,
    }));
    res.json(usuarios);
});

// Request -> Response -> Usuario | undefined
function buscarOtro(req, res) {
    const id = Number(req.params.id);
    const usuario = leer("usuarios").find((u) => u.id === id);
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

router.put("/:id/rol", (req, res) => {
    const usuario = buscarOtro(req, res);
    if (usuario === undefined) return;
    const rol = (req.body || {}).rol;
    if (!ROLES.includes(rol)) {
        return res.status(400).json({ error: "El rol tiene que ser usuario o admin." });
    }
    const actualizado = { ...usuario, rol: rol };
    guardar("usuarios", leer("usuarios").map((u) => (u.id === usuario.id ? actualizado : u)));
    res.json(datosPublicos(actualizado));
});

router.delete("/:id", (req, res) => {
    const usuario = buscarOtro(req, res);
    if (usuario === undefined) return;
    guardar("usuarios", leer("usuarios").filter((u) => u.id !== usuario.id));
    guardar("partidas", leer("partidas").filter((p) => p.usuario !== usuario.usuario));
    const sesiones = leer("sesiones");
    for (const token in sesiones) {
        if (sesiones[token] === usuario.usuario) delete sesiones[token];
    }
    guardar("sesiones", sesiones);
    res.status(204).end();
});

export default router;
