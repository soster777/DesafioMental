# Desafío Mental

- **Alumna:** Valentina Soster
- **Código de clase:** ACM4AP
- **Materia:** Plataformas de Desarrollo
- **Entrega:** Parcial II
- **Repositorio:** https://github.com/soster777/DesafioMental

## Descripción

Desafío Mental es un juego de preguntas y respuestas. En este parcial rehice la versión del primer parcial separándola en dos proyectos:

- `frontend/`: la interfaz, hecha con React y React Router (con Vite).
- `backend/`: un servidor con Node.js y Express que expone una API REST. Los datos se guardan en archivos JSON dentro de `backend/datos/`.

Además de lo que ya tenía el primer parcial, agregué:

- Una categoría "Mezcladas", con preguntas de todas las categorías.
- Una ruleta para elegir la categoría al azar.
- Ranking general y por categoría.
- Un panel para el administrador, con gestión de usuarios.
- Una página 404 propia y una versión para celular con barra de navegación abajo.

También está publicado en https://desafiomental.onrender.com. Como es un servidor gratuito, la primera carga puede tardar unos segundos, y los datos vuelven a los iniciales cada vez que el servidor se reinicia.

## Requisitos

- Node.js 20.19 o superior (se puede ver la versión con `node -v`).

## Instalación

Hay que instalar las dependencias de los dos proyectos:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Ejecución

Se necesitan dos terminales, una para cada proyecto.

En la primera se levanta el backend, que queda en http://localhost:3000:

```bash
cd backend
npm start
```

En la segunda se levanta el frontend, que queda en http://localhost:5173:

```bash
cd frontend
npm run dev
```

Después se abre http://localhost:5173 en el navegador. Vite redirige las peticiones que empiezan con `/api` al backend (está configurado en `frontend/vite.config.js`).

## Configuración

- El backend usa el puerto 3000. Se puede cambiar con `PORT=4000 npm start`, pero en ese caso también hay que cambiar el proxy en `frontend/vite.config.js`.
- La primera vez que se ejecuta, el backend crea la carpeta `backend/datos/` con las preguntas iniciales y un usuario administrador:
  - Usuario: `admin`
  - Contraseña: `admin1234`
- Para volver a los datos iniciales, se detiene el backend, se borra la carpeta `backend/datos/` y se vuelve a iniciar.

## Estructura del proyecto

```
backend/
  index.js          inicia el servidor y conecta las rutas
  datos.js          lectura y escritura de los archivos JSON
  routes/           endpoints de la API (auth, preguntas, partidas, estadisticas, usuarios)
  middlewares/      control de sesión y de rol de administrador
  logica/           reglas del juego, validaciones, estadísticas y ranking
frontend/src/
  pages/            una pantalla por cada ruta
  components/       componentes reutilizables (barra, reloj, ruleta, mensajes de carga y error)
  context/          AppContext, con la sesión del usuario y los mensajes
  hooks/            useDatos, para pedir datos a la API manejando la carga y los errores
  api.js            funciones para hacer las peticiones con el token de sesión
```

## Roles

Cada usuario tiene un id (1, 2, 3... según el orden de registro), que en el menú aparece como número de entrada.

- **Usuario**: se crea desde el registro. Puede jugar y ver sus estadísticas, su historial y el ranking.
- **Administrador**: tiene un panel propio en lugar del menú de juego. Desde ahí puede:
  - Dar de alta, modificar y eliminar preguntas.
  - Cambiar el rol de los usuarios o darlos de baja. No puede modificar su propia cuenta, para no quedarse sin acceso.
  - Probar partidas. Estas partidas no cuentan para el ranking y el administrador no tiene historial.

## API REST

Todas las rutas, salvo el registro y el login, necesitan el encabezado `Authorization: Bearer <token>`. Cuando hay un error, la respuesta tiene el formato `{ "error": "mensaje" }`.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/auth/registro` | público | Crea un usuario (201). Datos inválidos: 400. Usuario o email repetido: 409 |
| POST | `/api/auth/login` | público | Devuelve `{ token, usuario }`. Datos incorrectos: 401 |
| GET | `/api/auth/yo` | con sesión | Devuelve el usuario de la sesión (se usa para recuperarla al recargar) |
| POST | `/api/auth/logout` | con sesión | Cierra la sesión (204) |
| GET | `/api/preguntas/categorias` | con sesión | Categorías disponibles para jugar, incluida "Mezcladas" |
| GET | `/api/preguntas` | admin | Banco de preguntas completo |
| POST | `/api/preguntas` | admin | Alta de una pregunta (201) |
| PUT | `/api/preguntas/:id` | admin | Modificación de una pregunta |
| DELETE | `/api/preguntas/:id` | admin | Baja de una pregunta (204) |
| POST | `/api/partidas` | con sesión | Inicia una partida con `{ categoria, cantidad }` (201) |
| GET | `/api/partidas/:id` | dueño | Estado de la partida, sin las respuestas correctas |
| POST | `/api/partidas/:id/respuestas` | dueño | Responde la pregunta actual con `{ opcion }` (`null` si se terminó el tiempo) |
| PATCH | `/api/partidas/:id` | dueño | Abandona la partida con `{ estado: "abandonada" }` |
| GET | `/api/partidas?categoria=&estado=` | con sesión | Historial con filtros y resumen |
| GET | `/api/estadisticas` | con sesión | Estadísticas del usuario |
| GET | `/api/estadisticas/:categoria` | con sesión | Porcentaje de aciertos en una categoría |
| GET | `/api/ranking?categoria=` | con sesión | Las 10 mejores partidas completadas, sin contar las de administradores. Sin `categoria` devuelve el ranking general |
| GET | `/api/usuarios` | admin | Lista de usuarios con la cantidad de partidas completadas |
| PUT | `/api/usuarios/:id/rol` | admin | Cambia el rol a "usuario" o "admin" con `{ rol }`. Rol inválido o cuenta propia: 400 |
| DELETE | `/api/usuarios/:id` | admin | Elimina al usuario junto con sus partidas y sesiones (204). Cuenta propia: 400 |

Otros códigos que devuelve la API: 401 si no hay sesión, 403 si no tiene permiso (por rol o porque la partida es de otro usuario), 404 si el recurso no existe y 409 si la partida ya terminó.

## Publicación en Render

Para publicarlo se usa un solo servicio, porque en producción el backend también entrega el frontend compilado (`frontend/dist`). La configuración es:

- Build Command: `npm install --prefix backend && npm install --prefix frontend --include=dev && npm run build --prefix frontend`
- Start Command: `npm start --prefix backend`
- Variable de entorno: `NODE_VERSION=22`

Esta misma configuración está en el archivo `render.yaml`.
