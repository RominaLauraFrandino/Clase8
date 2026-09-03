// ============================================================
// CAPA DE CONTROLADORES: traduce HTTP <-> servicio.
// Su único trabajo: leer la petición, validar presencias,
// llamar al servicio y elegir el código de estado.
// Ni una consulta SQL, ni un .execute(): eso vive en services.
// ============================================================
const cabanasService = require("../services/cabanas.service");

// GET /api/cabanas
async function obtenerCabanas(req, res) {
  try {
    const cabanas = await cabanasService.listar();
    res.json(cabanas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener cabañas", error: error.message });
  }
}

// GET /api/cabanas/disponibles?desde=2026-09-05&hasta=2026-09-07
// Los QUERY PARAMS (?clave=valor) son la tercera vía de entrada:
// la ruta dice el recurso, el body trae contenido, y el query
// trae FILTROS opcionales. Se leen en req.query, siempre como texto.
async function obtenerDisponibles(req, res) {
  try {
    const { desde, hasta } = req.query;

    if (!desde || !hasta) {
      return res.status(400).json({ mensaje: "Debe indicar desde y hasta (AAAA-MM-DD)" });
    }

    const cabanas = await cabanasService.disponibles(desde, hasta);
    res.json(cabanas);
  } catch (error) {
    if (error.number >= 50000) {
      return res.status(400).json({ mensaje: error.message });
    }
    res.status(500).json({ mensaje: "Error al buscar disponibilidad", error: error.message });
  }
}

module.exports = { obtenerCabanas, obtenerDisponibles };
