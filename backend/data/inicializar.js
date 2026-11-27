import { existe, leerArchivo, guardarArchivo } from "./archivo.js";
import { PREGUNTAS_INICIALES } from "./preguntas-iniciales.js";
import { hashearClave, completarIds } from "../logica/usuarios.js";

// crea los archivos que falten la primera vez que se levanta el servidor
// () -> undefined
export async function inicializarDatos() {
    if (!(await existe("usuarios"))) {
        // el registro público solo crea usuarios comunes, así que el admin se crea acá
        await guardarArchivo("usuarios", [
            { id: 1, usuario: "admin", email: "admin@desafiomental.com", clave: hashearClave("admin1234"), rol: "admin" },
        ]);
    }
    // usuarios viejos sin id
    const usuarios = await leerArchivo("usuarios");
    if (usuarios.some((u) => !u.id)) {
        await guardarArchivo("usuarios", completarIds(usuarios));
    }
    if (!(await existe("preguntas"))) {
        await guardarArchivo("preguntas", PREGUNTAS_INICIALES);
    }
    if (!(await existe("partidas"))) {
        await guardarArchivo("partidas", []);
    }
    if (!(await existe("sesiones"))) {
        await guardarArchivo("sesiones", {});
    }
}
