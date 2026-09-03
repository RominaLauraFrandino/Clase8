// ============================================================
// CAPA DE SERVICIOS: reservas.
// Fijate que acá no hay res.status ni req.body: eso es del
// controlador. El servicio habla el idioma del NEGOCIO.
// ============================================================
const { sql, getConnection } = require("../config/db");

async function listar() {
  const pool = await getConnection();
  const resultado = await pool.request().execute("usp_ListarReservas");
  return resultado.recordset;
}

// Crea la reserva y devuelve su id.
// Las reglas (fechas, solapamiento) las hace cumplir la base:
// si algo está mal, el THROW del SP sube como excepción.
async function crear({ idCabana, cliente, telefono, desde, hasta }) {
  const pool = await getConnection();
  const resultado = await pool.request()
    .input("IdCabana", sql.Int, idCabana)
    .input("Cliente", sql.NVarChar(100), cliente)
    .input("Telefono", sql.NVarChar(20), telefono)
    .input("Desde", sql.Date, desde)
    .input("Hasta", sql.Date, hasta)
    .execute("usp_CrearReserva");
  return resultado.recordset[0].idReserva;
}

async function cancelar(idReserva) {
  const pool = await getConnection();
  await pool.request()
    .input("IdReserva", sql.Int, idReserva)
    .execute("usp_CancelarReserva");
}

module.exports = { listar, crear, cancelar };
