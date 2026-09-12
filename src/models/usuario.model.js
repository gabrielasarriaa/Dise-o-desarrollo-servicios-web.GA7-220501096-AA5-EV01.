/**
 * =============================================================================
 *  usuario.model.js
 * =============================================================================
 *  Modelo de acceso a datos para la entidad "Usuario" del servicio de
 *  autenticacion. Evidencia GA7-220501096-AA5-EV01 (Diseño y desarrollo de
 *  servicios web).
 *
 *  Para esta evidencia se utiliza un archivo JSON como almacenamiento
 *  (usuarios.json), en lugar de un motor de base de datos, ya que el
 *  alcance de la actividad es demostrar el diseño y la codificacion de un
 *  servicio web de registro/login, no la administracion de una base de
 *  datos. La estructura del modelo (findByUsuario, crear) esta pensada
 *  para poder reemplazarse mas adelante por un ORM (ej. Sequelize o el
 *  Eloquent de Laravel, definido en el stack tecnologico del proyecto
 *  CoVigilant) sin afectar al controlador que lo consume.
 * =============================================================================
 */

const fs = require('fs');
const path = require('path');

// Ruta absoluta del archivo que actua como "base de datos" de usuarios.
const RUTA_ARCHIVO = path.join(__dirname, '..', 'data', 'usuarios.json');

/**
 * Lee y devuelve el arreglo completo de usuarios almacenados.
 * @returns {Array<{usuario: string, contrasenaHash: string}>}
 */
function obtenerTodos() {
  const contenido = fs.readFileSync(RUTA_ARCHIVO, 'utf-8');
  return JSON.parse(contenido || '[]');
}

/**
 * Sobrescribe el archivo de usuarios con el arreglo recibido.
 * @param {Array} usuarios Arreglo de usuarios a persistir.
 */
function guardarTodos(usuarios) {
  fs.writeFileSync(RUTA_ARCHIVO, JSON.stringify(usuarios, null, 2), 'utf-8');
}

/**
 * Busca un usuario por su nombre de usuario (case-insensitive).
 * @param {string} nombreUsuario
 * @returns {Object|undefined} El registro del usuario si existe.
 */
function buscarPorUsuario(nombreUsuario) {
  const usuarios = obtenerTodos();
  return usuarios.find(
    (u) => u.usuario.toLowerCase() === String(nombreUsuario).toLowerCase()
  );
}

/**
 * Crea un nuevo usuario y lo persiste en el archivo de datos.
 * @param {string} nombreUsuario Nombre de usuario (unico).
 * @param {string} contrasenaHash Contraseña ya cifrada con bcrypt.
 * @returns {Object} El registro de usuario creado.
 */
function crearUsuario(nombreUsuario, contrasenaHash) {
  const usuarios = obtenerTodos();
  const nuevoUsuario = {
    id: usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1,
    usuario: nombreUsuario,
    contrasenaHash,
    fechaRegistro: new Date().toISOString()
  };
  usuarios.push(nuevoUsuario);
  guardarTodos(usuarios);
  return nuevoUsuario;
}

module.exports = {
  obtenerTodos,
  buscarPorUsuario,
  crearUsuario
};
