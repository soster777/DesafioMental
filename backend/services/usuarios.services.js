import * as usuariosData from "../data/usuarios.js";
import * as partidasData from "../data/partidas.js";
import * as sesionesData from "../data/sesiones.js";
import { crearError } from "./error.js";
import { datosPublicos } from "../logica/usuarios.js";

const ROLES = ["usuario", "admin"];

// () -> [Object]
export async function listarUsuarios() {
    const partidas = await partidasData.obtenerTodas();
    return (await usuariosData.obtenerTodos()).map((u) => ({
        ...datosPublicos(u),
        // las del admin son de prueba, no cuentan
        partidas: u.rol === "admin" ? null : partidas.filter((p) => p.usuario === u.usuario && p.estado === "completada").length,
    }));
}

// String -> Usuario -> Usuario
async function buscarOtro(idTexto, admin) {
    const usuario = await usuariosData.obtenerPorId(Number(idTexto));
    if (usuario === undefined) {
        throw crearError(404, "No existe el usuario " + idTexto + ".");
    }
    // así el admin no se puede dejar afuera a sí mismo
    if (usuario.id === admin.id) {
        throw crearError(400, "No podés modificar tu propia cuenta.");
    }
    return usuario;
}

// String -> String -> Usuario -> Usuario
export async function cambiarRol(idTexto, rol, admin) {
    const usuario = await buscarOtro(idTexto, admin);
    if (!ROLES.includes(rol)) {
        throw crearError(400, "El rol tiene que ser usuario o admin.");
    }
    return datosPublicos(await usuariosData.actualizar(usuario.id, { rol: rol }));
}

// String -> Usuario -> undefined
export async function eliminarUsuario(idTexto, admin) {
    const usuario = await buscarOtro(idTexto, admin);
    await usuariosData.eliminar(usuario.id);
    await partidasData.eliminarDelUsuario(usuario.usuario);
    await sesionesData.eliminarDelUsuario(usuario.usuario);
}
