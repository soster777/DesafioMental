import { leer } from "../datos.js";

// el front manda el token en el encabezado: Authorization: Bearer <token>
export function requiereSesion(req, res, next) {
    const encabezado = req.get("Authorization") || "";
    const token = encabezado.replace("Bearer ", "");
    const nombre = leer("sesiones")[token];
    const usuario = leer("usuarios").find((u) => u.usuario === nombre);
    if (usuario === undefined) {
        return res.status(401).json({ error: "Tenés que iniciar sesión." });
    }
    req.usuario = usuario;
    req.token = token;
    next();
}

// va siempre después de requiereSesion
export function soloAdmin(req, res, next) {
    if (req.usuario.rol !== "admin") {
        return res.status(403).json({ error: "No tenés permiso para esta operación." });
    }
    next();
}
