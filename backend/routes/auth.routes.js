import { Router } from "express";
import { registrar, login, obtenerSesion, logout } from "../controllers/auth.controllers.js";

const router = Router();

// POST /api/auth/registro
router.post("/registro", registrar);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/yo
router.get("/yo", obtenerSesion);

// POST /api/auth/logout
router.post("/logout", logout);

export default router;
