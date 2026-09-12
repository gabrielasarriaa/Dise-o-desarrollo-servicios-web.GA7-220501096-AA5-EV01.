/**
 * =============================================================================
 *  server.js
 * =============================================================================
 *  Punto de entrada del servicio web de registro e inicio de sesion.
 *  Proyecto: CoVigilant - GEA Soluciones IT
 *  Evidencia: GA7-220501096-AA5-EV01 (Diseño y desarrollo de servicios web - caso)
 *
 *  Este servicio expone una API REST construida con Node.js y Express,
 *  siguiendo el mismo enfoque de arquitectura por capas (rutas ->
 *  controladores -> modelo) documentado en el stack tecnologico del
 *  proyecto (ver Informe de Entregables, GA4-220501095-AA2-EV02).
 *
 *  Endpoints disponibles:
 *    POST /api/registro  -> Registra un nuevo usuario
 *    POST /api/login      -> Autentica un usuario existente
 *
 *  Para ejecutar el servidor:
 *    1. npm install
 *    2. npm start
 *    3. El servidor queda escuchando en http://localhost:3000
 * =============================================================================
 */

const express = require('express');
const path = require('path');
const authRoutes = require('./src/routes/auth.routes');

const app = express();
const PUERTO = process.env.PORT || 3000;

// Middleware para interpretar el body de las peticiones como JSON
app.use(express.json());

// Sirve la pagina de prueba estatica (public/index.html) para probar
// el servicio desde el navegador sin necesidad de Postman.
app.use(express.static(path.join(__dirname, 'public')));

// Todas las rutas de autenticacion quedan bajo el prefijo /api
app.use('/api', authRoutes);

// Manejador de rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ exito: false, mensaje: 'Recurso no encontrado.' });
});

// Manejador global de errores no controlados (evita que el servidor se caiga)
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ exito: false, mensaje: 'Error interno del servidor.' });
});

app.listen(PUERTO, () => {
  console.log(`Servicio de autenticacion CoVigilant escuchando en http://localhost:${PUERTO}`);
});
