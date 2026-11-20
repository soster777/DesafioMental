import fs from "node:fs";
import path from "node:path";
import { PREGUNTAS_INICIALES } from "./logica/preguntas-iniciales.js";
import { hashearClave, completarNumeros } from "./logica/usuarios.js";

const CARPETA = path.join(import.meta.dirname, "datos");

// String -> String
function rutaDe(nombre) {
    return path.join(CARPETA, nombre + ".json");
}

// String -> a
export function leer(nombre) {
    return JSON.parse(fs.readFileSync(rutaDe(nombre), "utf-8"));
}

// shortcut: escribe el archivo entero en cada cambio; alcanza para un solo servidor, con muchos usuarios habría que pasar a una base de datos
// String -> a -> undefined
export function guardar(nombre, valor) {
    fs.writeFileSync(rutaDe(nombre), JSON.stringify(valor, null, 2));
}

// () -> undefined
export function inicializarDatos() {
    fs.mkdirSync(CARPETA, { recursive: true });
    if (!fs.existsSync(rutaDe("usuarios"))) {
        // el registro público solo crea usuarios comunes, así que el admin se crea acá
        guardar("usuarios", [
            { numero: 1, usuario: "admin", email: "admin@desafiomental.com", clave: hashearClave("admin1234"), rol: "admin" },
        ]);
    }
    // los usuarios creados antes de que existiera el número de socio lo reciben acá, una sola vez
    const usuarios = leer("usuarios");
    if (usuarios.some((u) => !u.numero)) {
        guardar("usuarios", completarNumeros(usuarios));
    }
    if (!fs.existsSync(rutaDe("preguntas"))) {
        guardar("preguntas", PREGUNTAS_INICIALES);
    }
    if (!fs.existsSync(rutaDe("partidas"))) {
        guardar("partidas", []);
    }
    if (!fs.existsSync(rutaDe("sesiones"))) {
        guardar("sesiones", {});
    }
}
