/**
 * =============================================================================
 *  auth.routes.js
 * =============================================================================
 *  Define los endpoints (rutas) del servicio web de autenticacion y los
 *  conecta con sus respectivos controladores. Evidencia GA7-AA5-EV01.
 * =============================================================================
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/registro -> crea un nuevo usuario
router.post('/registro', authController.registrar);

// POST /api/login -> valida credenciales de un usuario existente
router.post('/login', authController.iniciarSesion);

module.exports = router;
