// ============================================================
// Rutas de cabañas (rutas fijas antes que variables, como siempre)
// ============================================================
const express = require("express");
const router = express.Router();

const { obtenerCabanas, obtenerDisponibles } = require("../controllers/cabanas.controller");

// GET /api/cabanas               -> todas las cabañas
router.get("/", obtenerCabanas);

// GET /api/cabanas/disponibles?desde=...&hasta=...  -> las libres en el rango
router.get("/disponibles", obtenerDisponibles);

module.exports = router;
