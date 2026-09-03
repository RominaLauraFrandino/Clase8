// ============================================================
// Rutas de reservas
// ============================================================
const express = require("express");
const router = express.Router();

const { obtenerReservas, crearReserva, cancelarReserva } = require("../controllers/reservas.controller");

// GET    /api/reservas      -> listado con noches y total
router.get("/", obtenerReservas);

// POST   /api/reservas      -> nueva reserva
router.post("/", crearReserva);

// DELETE /api/reservas/:id  -> cancelar
router.delete("/:id", cancelarReserva);

module.exports = router;
