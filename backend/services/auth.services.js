import crypto from "node:crypto";
import * as usuariosData from "../data/usuarios.js";
import * as sesionesData from "../data/sesiones.js";
import { crearError } from "./error.js";
import {
    comoTexto,
    validarRegistro,
    buscarRepetidos,
    buscarPorNombre,
    hashearClave,
    claveCorrecta,
    datosPublicos,
} from "../logica/usuarios.js";

// Object -> Usuario
export async function registrarUsuario(cuerpo) {
    const datos = {
        usuario: comoTexto(cuerpo.usuario).trim(),
        email: comoTexto(cuerpo.email).trim(),
        clave: comoTexto(cuerpo.clave),
        confirmacion: comoTexto(cuerpo.confirmacion),
    };

    const errores = validarRegistro(datos);
    if (errores.length > 0) {
        throw crearError(400, "Revisá los datos del registro.", errores);
    }
    const repetidos = buscarRepetidos(await usuariosData.obtenerTodos(), datos);
    if (repetidos.length > 0) {
        throw crearError(409, "El usuario o el correo ya están registrados.", repetidos);
    }

    // el registro público siempre crea usuarios comunes
    const nuevo = await usuariosData.crear({
        id: await usuariosData.obtenerProximoId(),
        usuario: datos.usuario,
        email: datos.email,
        clave: hashearClave(datos.clave),
        rol: "usuario",
    });
    return datosPublicos(nuevo);
}

// Object -> { token: String, usuario: Usuario }
export async function iniciarSesion(cuerpo) {
    const usuario = buscarPorNombre(await usuariosData.obtenerTodos(), comoTexto(cuerpo.usuario));
    if (usuario === undefined || !claveCorrecta(comoTexto(cuerpo.clave), usuario.clave)) {
        throw crearError(401, "Los datos ingresados son incorrectos.");
    }
    const token = crypto.randomUUID();
    await sesionesData.crear(token, usuario.usuario);
    return { token: token, usuario: datosPublicos(usuario) };
}

// el front manda el token en el encabezado: Authorization: Bearer <token>
// String -> String
function obtenerToken(autorizacion) {
    return (autorizacion || "").replace("Bearer ", "");
}

// String -> Usuario
export async function obtenerUsuarioDeSesion(autorizacion) {
    const nombre = await sesionesData.obtenerUsuario(obtenerToken(autorizacion));
    const usuario = nombre === undefined ? undefined : await usuariosData.obtenerPorNombre(nombre);
    if (usuario === undefined) {
        throw crearError(401, "Tenés que iniciar sesión.");
    }
    return usuario;
}

// String -> Usuario
export async function obtenerAdminDeSesion(autorizacion) {
    const usuario = await obtenerUsuarioDeSesion(autorizacion);
    if (usuario.rol !== "admin") {
        throw crearError(403, "No tenés permiso para esta operación.");
    }
    return usuario;
}

// String -> Usuario
export async function obtenerSesion(autorizacion) {
    return datosPublicos(await obtenerUsuarioDeSesion(autorizacion));
}

// String -> undefined
export async function cerrarSesion(autorizacion) {
    await obtenerUsuarioDeSesion(autorizacion);
    await sesionesData.eliminar(obtenerToken(autorizacion));
}
