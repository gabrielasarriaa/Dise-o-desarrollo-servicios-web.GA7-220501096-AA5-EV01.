/**
 * =============================================================================
 *  auth.controller.js
 * =============================================================================
 *  Controlador del servicio web de autenticacion.
 *  Evidencia GA7-220501096-AA5-EV01 (Diseño y desarrollo de servicios web - caso).
 *
 *  Caso a resolver:
 *  "Se requiere un servicio web para un registro y un inicio de sesion.
 *   El servicio recibe un usuario y una contraseña; si la autenticacion es
 *   correcta debe salir un mensaje de autenticacion satisfactoria, en caso
 *   contrario debe devolver error en la autenticacion."
 *
 *  Este archivo contiene dos controladores (registrar, iniciarSesion) que
 *  seran usados por las rutas definidas en auth.routes.js. Se aplica
 *  separacion de responsabilidades: las rutas solo enrutan, el controlador
 *  contiene la logica, y el modelo (usuario.model.js) se encarga del acceso
 *  a los datos.
 * =============================================================================
 */

const bcrypt = require('bcryptjs');
const usuarioModel = require('../models/usuario.model');

// Numero de "rondas" de cifrado de bcrypt. A mayor numero, mas seguro pero
// mas lento. 10 es un valor estandar recomendado para produccion.
const RONDAS_BCRYPT = 10;

/**
 * POST /api/registro
 * Registra un nuevo usuario en el sistema.
 *
 * Body esperado: { "usuario": "string", "contrasena": "string" }
 *
 * Respuestas:
 *  - 201 Created  -> usuario registrado correctamente
 *  - 400 Bad Request -> faltan datos o la contraseña no cumple requisitos
 *  - 409 Conflict -> el usuario ya existe
 */
function registrar(req, res) {
  const { usuario, contrasena } = req.body;

  // 1. Validacion de campos obligatorios (regla de negocio basica de la HU de registro)
  if (!usuario || !contrasena) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error en la autenticacion: debe indicar usuario y contraseña.'
    });
  }

  // 2. Validacion de longitud minima de la contraseña (buena practica de seguridad)
  if (contrasena.length < 6) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error en la autenticacion: la contraseña debe tener al menos 6 caracteres.'
    });
  }

  // 3. Verificar que el usuario no exista previamente
  const usuarioExistente = usuarioModel.buscarPorUsuario(usuario);
  if (usuarioExistente) {
    return res.status(409).json({
      exito: false,
      mensaje: 'Error en la autenticacion: el usuario ya se encuentra registrado.'
    });
  }

  // 4. Cifrar la contraseña antes de almacenarla (NUNCA se guarda en texto plano)
  const contrasenaHash = bcrypt.hashSync(contrasena, RONDAS_BCRYPT);

  // 5. Persistir el nuevo usuario
  const nuevoUsuario = usuarioModel.crearUsuario(usuario, contrasenaHash);

  return res.status(201).json({
    exito: true,
    mensaje: 'Autenticacion satisfactoria: usuario registrado correctamente.',
    datos: { id: nuevoUsuario.id, usuario: nuevoUsuario.usuario }
  });
}

/**
 * POST /api/login
 * Autentica a un usuario ya registrado.
 *
 * Body esperado: { "usuario": "string", "contrasena": "string" }
 *
 * Respuestas:
 *  - 200 OK -> "Autenticacion satisfactoria" (usuario y contraseña correctos)
 *  - 401 Unauthorized -> "Error en la autenticacion" (usuario o contraseña incorrectos)
 *  - 400 Bad Request -> faltan datos en la peticion
 */
function iniciarSesion(req, res) {
  const { usuario, contrasena } = req.body;

  // 1. Validacion de campos obligatorios
  if (!usuario || !contrasena) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error en la autenticacion: debe indicar usuario y contraseña.'
    });
  }

  // 2. Buscar el usuario en el "almacen" de datos
  const usuarioEncontrado = usuarioModel.buscarPorUsuario(usuario);

  // 3. Si no existe, se responde con el mismo mensaje generico de error que
  //    si la contraseña fuera incorrecta. Esto es una buena practica de
  //    seguridad: no revelar si el usuario existe o no existe.
  if (!usuarioEncontrado) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Error en la autenticacion: usuario o contraseña incorrectos.'
    });
  }

  // 4. Comparar la contraseña recibida contra el hash almacenado
  const contrasenaValida = bcrypt.compareSync(contrasena, usuarioEncontrado.contrasenaHash);

  if (!contrasenaValida) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Error en la autenticacion: usuario o contraseña incorrectos.'
    });
  }

  // 5. Autenticacion correcta
  return res.status(200).json({
    exito: true,
    mensaje: 'Autenticacion satisfactoria.',
    datos: { id: usuarioEncontrado.id, usuario: usuarioEncontrado.usuario }
  });
}

module.exports = {
  registrar,
  iniciarSesion
};
