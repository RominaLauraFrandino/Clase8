// ============================================================
// Servidor principal - Complejo Los Aromos
// Clase 08: Arquitectura en capas
//
// El viaje de una petición ahora es:
//   middleware (logger) -> ruta -> controlador -> servicio -> BD
// y la respuesta vuelve por el mismo camino.
// ============================================================
const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "../.env") });

const logger = require("./middlewares/logger");
const cabanasRoutes = require("./routes/cabanas.routes");
const reservasRoutes = require("./routes/reservas.routes");

const app = express();

// Middlewares globales: el orden importa (se ejecutan en cadena)
app.use(cors());          // permisos de origen cruzado
app.use(express.json());  // parseo del body JSON
app.use(logger);          // nuestro middleware: registra cada petición

// Rutas de la API
app.use("/api/cabanas", cabanasRoutes);
app.use("/api/reservas", reservasRoutes);

// Ruta raíz: verificación rápida de que la API está viva
app.get("/", (req, res) => {
  res.send("API Complejo Los Aromos funcionando");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
