// ============================================================
// MIDDLEWARE PROPIO: registro de peticiones.
// Un middleware es una función (req, res, next) por la que pasan
// TODAS las peticiones antes de llegar a las rutas. Ya venimos
// usando dos ajenos (cors, express.json); hoy escribimos el nuestro.
//
// Este anota método, URL, código de respuesta y cuánto tardó:
//   GET /api/reservas -> 200 (35 ms)
// ============================================================
function logger(req, res, next) {
  const inicio = Date.now();

  // El evento "finish" se dispara cuando la respuesta ya salió:
  // recién ahí conocemos el código y el tiempo total.
  res.on("finish", () => {
    const ms = Date.now() - inicio;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms} ms)`);
  });

  // next() le pasa la posta al siguiente eslabón de la cadena.
  // Si un middleware no llama a next() (ni responde), la petición
  // queda colgada para siempre: es el error clásico.
  next();
}

module.exports = logger;
