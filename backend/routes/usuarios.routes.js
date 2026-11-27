import { Router } from "express";
import { requiereSesion, soloAdmin } from "../middlewares/sesion.js";
import { listarUsuarios, modificarRol, borrarUsuario } from "../controllers/usuarios.controllers.js";

const router = Router();

router.use(requiereSesion, soloAdmin);

// GET /api/usuarios
router.get("/", listarUsuarios);

// PUT /api/usuarios/:id/rol
router.put("/:id/rol", modificarRol);

// DELETE /api/usuarios/:id
router.delete("/:id", borrarUsuario);

export default router;
