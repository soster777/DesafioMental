import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";

const CARPETA = import.meta.dirname;

// String -> String
function rutaDe(nombre) {
    return path.join(CARPETA, nombre + ".json");
}

// String -> Boolean
export async function existe(nombre) {
    try {
        await access(rutaDe(nombre));
        return true;
    } catch (error) {
        return false;
    }
}

// String -> a
export async function leerArchivo(nombre) {
    const contenido = await readFile(rutaDe(nombre), "utf-8");
    return JSON.parse(contenido);
}

// shortcut: escribe el archivo entero en cada cambio; alcanza para un solo servidor, con muchos usuarios habría que pasar a una base de datos
// String -> a -> undefined
export async function guardarArchivo(nombre, valor) {
    await writeFile(rutaDe(nombre), JSON.stringify(valor, null, 2), "utf-8");
}
