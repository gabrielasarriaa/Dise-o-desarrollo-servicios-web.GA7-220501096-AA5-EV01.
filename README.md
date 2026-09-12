# CoVigilant — Servicio Web de Registro e Inicio de Sesión

**Evidencia:** GA7-220501096-AA5-EV01 — Diseño y desarrollo de servicios web - caso
**Programa:** Análisis y Desarrollo de Software — SENA, ficha 3235891
**Aprendiz:** Gabriela Andreina Sarria Robaina — Grupo GEA
**Instructor:** Ing. Fernando Forero Gómez

## 1. Caso a resolver

> Se requiere un servicio web para un registro y un inicio de sesión. El
> servicio recibe un usuario y una contraseña; si la autenticación es
> correcta debe salir un mensaje de autenticación satisfactoria; en caso
> contrario, debe devolver error en la autenticación.

## 2. Diseño del servicio

Se diseñó una API REST con arquitectura por capas, coherente con el stack
tecnológico documentado previamente para el proyecto CoVigilant (Node.js /
Express como equivalente ligero al backend Laravel definido en el informe
de entregables):

```
Cliente (navegador / Postman)
        │  HTTP JSON
        ▼
   Rutas (auth.routes.js)      -> define los endpoints
        ▼
Controlador (auth.controller.js) -> valida datos y aplica la lógica de negocio
        ▼
   Modelo (usuario.model.js)   -> lee/escribe en el archivo usuarios.json
```

### Endpoints

| Método | Ruta | Descripción | Body (JSON) |
|---|---|---|---|
| POST | `/api/registro` | Registra un nuevo usuario | `{ "usuario": "...", "contrasena": "..." }` |
| POST | `/api/login` | Autentica un usuario existente | `{ "usuario": "...", "contrasena": "..." }` |

### Reglas de negocio aplicadas

- El usuario y la contraseña son obligatorios en ambos endpoints.
- La contraseña debe tener mínimo 6 caracteres al registrarse.
- No se permite registrar dos veces el mismo nombre de usuario.
- Las contraseñas **nunca se almacenan en texto plano**: se cifran con
  `bcrypt` (hash + salt) antes de guardarse.
- Ante un usuario inexistente o una contraseña incorrecta, el servicio
  responde siempre con el mismo mensaje genérico de error (buena práctica
  de seguridad: no revela si el usuario existe o no).

### Mensajes de respuesta

- Autenticación correcta → `"Autenticacion satisfactoria."` (HTTP 200)
- Registro correcto → `"Autenticacion satisfactoria: usuario registrado correctamente."` (HTTP 201)
- Cualquier fallo de validación o credenciales → `"Error en la autenticacion: ..."` (HTTP 400/401/409)

## 3. Cómo ejecutar el proyecto

Requisitos: tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).

```bash
# 1. Instalar dependencias
npm install

# 2. Levantar el servidor
npm start

# El servicio queda disponible en:
# http://localhost:3000
```

## 4. Cómo probar el servicio

### Opción A — Desde el navegador (más simple)
Con el servidor corriendo, abre `http://localhost:3000` en tu navegador.
Vas a ver un formulario de Registro y otro de Inicio de sesión que
consumen la API mediante `fetch`.

### Opción B — Con Postman / Thunder Client
Importa o crea manualmente estas dos peticiones:

**Registro**
```
POST http://localhost:3000/api/registro
Content-Type: application/json

{
  "usuario": "gabriela",
  "contrasena": "clave123"
}
```

**Login**
```
POST http://localhost:3000/api/login
Content-Type: application/json

{
  "usuario": "gabriela",
  "contrasena": "clave123"
}
```

### Opción C — Con curl (terminal)
```bash
curl -X POST http://localhost:3000/api/registro \
  -H "Content-Type: application/json" \
  -d "{\"usuario\":\"gabriela\",\"contrasena\":\"clave123\"}"

curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"usuario\":\"gabriela\",\"contrasena\":\"clave123\"}"
```

## 5. Casos de prueba verificados

| # | Escenario | Resultado esperado |
|---|---|---|
| 1 | Registro con datos válidos | 201 — Autenticación satisfactoria (registrado) |
| 2 | Registro con usuario ya existente | 409 — Error en la autenticación |
| 3 | Registro con contraseña < 6 caracteres | 400 — Error en la autenticación |
| 4 | Login con usuario y contraseña correctos | 200 — Autenticación satisfactoria |
| 5 | Login con contraseña incorrecta | 401 — Error en la autenticación |
| 6 | Login con usuario inexistente | 401 — Error en la autenticación |
| 7 | Login sin enviar datos | 400 — Error en la autenticación |

Los 7 escenarios fueron ejecutados y validados antes de la entrega.

## 6. Estructura del proyecto

```
covigilant-auth-api/
├── server.js                     # Punto de entrada del servidor Express
├── package.json
├── src/
│   ├── routes/auth.routes.js     # Definición de endpoints
│   ├── controllers/auth.controller.js  # Lógica de negocio (registro/login)
│   ├── models/usuario.model.js   # Acceso a datos (archivo usuarios.json)
│   └── data/usuarios.json        # "Base de datos" en archivo (vacía por defecto)
├── public/index.html             # Cliente de prueba en el navegador
└── .gitignore
```

## 7. Control de versiones

El proyecto se gestionó con Git desde su creación. Ver `enlace_repositorio.txt`
para el enlace al repositorio publicado en GitHub.
