// ============================================================
// CAPA DE SERVICIOS: la lógica de la aplicación y el acceso
// a datos. NO sabe nada de HTTP: no conoce req, res ni códigos
// de estado. Recibe datos simples y devuelve datos simples.
// Por eso mismo, mañana podría usarse desde otro lugar
// (una app de escritorio, un test automático) sin tocar nada.
// ============================================================
const { sql, getConnection } = require("../config/db");

// Todas las cabañas del complejo
async function listar() {
  const pool = await getConnection();
  const resultado = await pool.request().execute("usp_ListarCabanas");
  return resultado.recordset;
}

// Cabañas libres en un rango de fechas, con el total de la estadía
async function disponibles(desde, hasta) {
  const pool = await getConnection();
  const resultado = await pool.request()
    .input("Desde", sql.Date, desde)
    .input("Hasta", sql.Date, hasta)
    .execute("usp_CabanasDisponibles");
  return resultado.recordset;
}

module.exports = { listar, disponibles };
