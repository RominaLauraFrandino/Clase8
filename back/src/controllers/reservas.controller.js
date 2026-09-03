// ============================================================
// CAPA DE CONTROLADORES: reservas.
// Compará con clases anteriores: el controlador quedó más corto
// porque el acceso a datos se mudó al servicio.
// ============================================================
const reservasService = require("../services/reservas.service");

function esErrorDeNegocio(error) {
  return typeof error.number === "number" && error.number >= 50000;
}

// GET /api/reservas
async function obtenerReservas(req, res) {
  try {
    const reservas = await reservasService.listar();
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener reservas", error: error.message });
  }
}

// POST /api/reservas   Body: { idCabana, cliente, telefono, desde, hasta }
async function crearReserva(req, res) {
  try {
    const { idCabana, cliente, telefono, desde, hasta } = req.body;

    if (!idCabana || !cliente || !telefono || !desde || !hasta) {
      return res.status(400).json({ mensaje: "Debe completar todos los datos" });
    }

    const idReserva = await reservasService.crear({ idCabana, cliente, telefono, desde, hasta });

    res.status(201).json({ mensaje: "Reserva registrada correctamente", idReserva });
  } catch (error) {
    if (error.number === 50002) {
      return res.status(404).json({ mensaje: error.message });
    }
    if (esErrorDeNegocio(error)) {
      // 50003 cliente, 50012 fechas, 50013 solapamiento
      return res.status(400).json({ mensaje: error.message });
    }
    res.status(500).json({ mensaje: "Error al registrar la reserva", error: error.message });
  }
}

// DELETE /api/reservas/:id
async function cancelarReserva(req, res) {
  try {
    const idReserva = Number(req.params.id);

    if (!idReserva) {
      return res.status(400).json({ mensaje: "El id de la reserva no es válido" });
    }

    await reservasService.cancelar(idReserva);

    res.json({ mensaje: "Reserva cancelada correctamente" });
  } catch (error) {
    if (error.number === 50002) {
      return res.status(404).json({ mensaje: error.message });
    }
    res.status(500).json({ mensaje: "Error al cancelar la reserva", error: error.message });
  }
}

module.exports = { obtenerReservas, crearReserva, cancelarReserva };
