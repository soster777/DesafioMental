import crypto from "node:crypto";

// a -> String
export function comoTexto(valor) {
    if (typeof valor === "string") {
        return valor;
    }
    return "";
}

// String -> Boolean
function esEmailValido(email) {
    if (email.includes(" ")) {
        return false;
    }
    const partes = email.split("@");
    if (partes.length !== 2) {
        return false;
    }
    const nombre = partes[0];
    const dominio = partes[1];
    return nombre.length > 0 && dominio.includes(".") && !dominio.startsWith(".") && !dominio.endsWith(".");
}

// String -> String
function normalizar(texto) {
    return texto.trim().toLowerCase();
}

// [Usuario] -> String -> Usuario
export function buscarPorNombre(usuarios, nombreUsuario) {
    return usuarios.find((usuario) => normalizar(usuario.usuario) === normalizar(nombreUsuario));
}

// [Usuario] -> String -> Usuario
function buscarPorEmail(usuarios, email) {
    return usuarios.find((usuario) => normalizar(usuario.email) === normalizar(email));
}

// Object -> [String]
export function validarRegistro(datos) {
    if (datos.usuario === "" || datos.email === "" || datos.clave === "" || datos.confirmacion === "") {
        return ["Completá todos los campos."];
    }

    const errores = [];
    if (!esEmailValido(datos.email)) {
        errores.push("El correo electrónico no tiene un formato válido.");
    }
    if (datos.usuario.length < 4 || datos.usuario.length > 16) {
        errores.push("El nombre de usuario tiene que tener entre 4 y 16 caracteres.");
    }
    if (datos.clave.length < 8) {
        errores.push("La contraseña tiene que tener al menos 8 caracteres.");
    }
    if (datos.clave !== datos.confirmacion) {
        errores.push("La contraseña y la confirmación no coinciden.");
    }
    return errores;
}

// [Usuario] -> Object -> [String]
export function buscarRepetidos(usuarios, datos) {
    const errores = [];
    if (buscarPorNombre(usuarios, datos.usuario) !== undefined) {
        errores.push("Ya existe un usuario con ese nombre.");
    }
    if (buscarPorEmail(usuarios, datos.email) !== undefined) {
        errores.push("Ya existe una cuenta con ese correo.");
    }
    return errores;
}

// String -> String
export function hashearClave(clave) {
    const sal = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(clave, sal, 64).toString("hex");
    return sal + ":" + hash;
}

// String -> String -> Boolean
export function claveCorrecta(clave, guardada) {
    const [sal, hash] = guardada.split(":");
    const intento = crypto.scryptSync(clave, sal, 64);
    return crypto.timingSafeEqual(intento, Buffer.from(hash, "hex"));
}

// Usuario -> Object
export function datosPublicos(usuario) {
    return { id: usuario.id, usuario: usuario.usuario, email: usuario.email, rol: usuario.rol };
}

// [Usuario] -> [Usuario]
export function completarIds(usuarios) {
    return usuarios.map((u, indice) => {
        if (u.id) {
            return u;
        }
        const { numero, ...resto } = u;
        return { id: numero || indice + 1, ...resto };
    });
}
