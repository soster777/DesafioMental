# Desafío Mental (Parcial II, Plataformas de Desarrollo)

Juego de preguntas y respuestas. Es la versión del primer parcial rehecha con:

- `frontend/`: React + React Router, con Vite.
- `backend/`: Node.js + Express, una API REST que guarda los datos en archivos JSON (`backend/datos/`).

## Requisitos

- Node.js 20.11 o más nuevo (`node -v` para ver la versión).

## Instalación

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Ejecución

Hacen falta dos terminales, una por proyecto.

Terminal 1, el backend (queda en http://localhost:3000):

```bash
cd backend
npm start
```

Terminal 2, el frontend (queda en http://localhost:5173):

```bash
cd frontend
npm run dev
```

Después se abre http://localhost:5173 en el navegador. Vite reenvía todo lo que empieza con `/api` al backend (la configuración está en `frontend/vite.config.js`).

## Configuración

- El backend usa el puerto 3000. Para cambiarlo: `PORT=4000 npm start`. Si se cambia, hay que actualizar también el proxy en `frontend/vite.config.js`.
- La primera vez que arranca, el backend crea `backend/datos/` con las preguntas iniciales y un administrador:
  - usuario: `admin`
  - contraseña: `admin1234`
- Para volver a los datos iniciales: frenar el backend, borrar la carpeta `backend/datos/` y arrancarlo de nuevo.

## Roles

Cada usuario tiene un número de socio (1, 2, 3... por orden de registro) que se ve en la entrada del menú.

- **usuario**: se crea desde el registro público. Juega y ve sus estadísticas, el historial y el ranking.
- **admin**: además gestiona el banco de preguntas desde "Preguntas" (alta, edición y baja).

## API REST

Todas las rutas, salvo registro y login, piden el encabezado `Authorization: Bearer <token>`. Los errores siempre vuelven como `{ "error": "mensaje" }`.

| Método | Ruta | Quién | Qué hace |
|---|---|---|---|
| POST | `/api/auth/registro` | público | Crea un usuario (201). Datos inválidos: 400. Usuario o email repetido: 409 |
| POST | `/api/auth/login` | público | Devuelve `{ token, usuario }`. Datos incorrectos: 401 |
| GET | `/api/auth/yo` | logueado | Usuario de la sesión (para recuperarla al recargar) |
| POST | `/api/auth/logout` | logueado | Cierra la sesión (204) |
| GET | `/api/preguntas/categorias` | logueado | Lista de categorías para jugar (incluye "Mezcladas", que junta preguntas de todas) |
| GET | `/api/preguntas` | admin | Banco completo |
| POST | `/api/preguntas` | admin | Alta (201) |
| PUT | `/api/preguntas/:id` | admin | Modificación |
| DELETE | `/api/preguntas/:id` | admin | Baja (204) |
| POST | `/api/partidas` | logueado | Empieza una partida `{ categoria, cantidad }` (201) |
| GET | `/api/partidas/:id` | dueño | Estado de la partida (sin las respuestas correctas) |
| POST | `/api/partidas/:id/respuestas` | dueño | Responde la pregunta actual `{ opcion }` (`null` si se terminó el tiempo) |
| PATCH | `/api/partidas/:id` | dueño | Abandona `{ estado: "abandonada" }` |
| GET | `/api/partidas?categoria=&estado=` | logueado | Historial con filtros y resumen |
| GET | `/api/estadisticas` | logueado | Estadísticas personales |
| GET | `/api/estadisticas/:categoria` | logueado | % de aciertos en una categoría |
| GET | `/api/ranking?categoria=` | logueado | Top 10 de partidas completadas; sin `categoria` es el ranking general |

Sin sesión: 401. Sin permiso (rol o partida de otro): 403. Recurso inexistente: 404. Partida ya terminada: 409.
