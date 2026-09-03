// ============================================================
// Front - Complejo Los Aromos (Clase 08)
// Novedad: el buscador arma la URL con QUERY PARAMS
// (/api/cabanas/disponibles?desde=...&hasta=...) y la reserva
// usa las fechas buscadas. La regla de no solapamiento vive en
// la base; acá solo mostramos su veredicto.
// ============================================================
const API_URL = "http://localhost:3000/api";

// Elementos del DOM
const formBusqueda = document.querySelector("#formBusqueda");
const inputDesde = document.querySelector("#desde");
const inputHasta = document.querySelector("#hasta");
const inputCliente = document.querySelector("#cliente");
const inputTelefono = document.querySelector("#telefono");
const resultado = document.querySelector("#resultado");
const listadoReservas = document.querySelector("#listadoReservas");
const mensaje = document.querySelector("#mensaje");

const formatoPrecio = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});

// Las fechas AAAA-MM-DD se muestran como DD/MM
function fechaCorta(fechaIso) {
    const [anio, mes, dia] = fechaIso.split("T")[0].split("-");
    return `${dia}/${mes}`;
}

// ------------------------------------------------------------
// Buscar disponibilidad (GET con query params)
// ------------------------------------------------------------
async function buscarDisponibles(evento) {
    evento.preventDefault();

    const desde = inputDesde.value;
    const hasta = inputHasta.value;

    if (!desde || !hasta) {
        mostrarMensaje("Elegí las dos fechas.", "error");
        return;
    }

    try {
        // La URL se arma con los filtros como query params
        const url = `${API_URL}/cabanas/disponibles?desde=${desde}&hasta=${hasta}`;
        const respuesta = await fetch(url);
        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje);
        }

        mostrarDisponibles(data);
        mostrarMensaje(`${data.length} cabaña(s) disponible(s) del ${fechaCorta(desde)} al ${fechaCorta(hasta)}.`, "ok");

    } catch (error) {
        resultado.innerHTML = "";
        mostrarMensaje(`Error: ${error.message}`, "error");
        console.error(error);
    }
}

function mostrarDisponibles(cabanas) {
    resultado.innerHTML = "";

    if (cabanas.length === 0) {
        resultado.innerHTML = '<p class="sin-resultados">No hay cabañas libres en esas fechas.</p>';
        return;
    }

    cabanas.forEach(cabana => {
        resultado.innerHTML += `
            <div class="tarjeta">
                <h3>${cabana.nombre}</h3>
                <p>Hasta ${cabana.capacidad} personas</p>
                <p>${formatoPrecio.format(cabana.precioNoche)} por noche</p>
                <p class="total">${cabana.noches} noches: ${formatoPrecio.format(cabana.totalEstadia)}</p>
                <button data-id="${cabana.idCabana}">Reservar</button>
            </div>
        `;
    });
}

// ------------------------------------------------------------
// POST: reservar una cabaña con las fechas buscadas
// ------------------------------------------------------------
async function reservar(idCabana) {
    const nuevaReserva = {
        idCabana,
        cliente: inputCliente.value.trim(),
        telefono: inputTelefono.value.trim(),
        desde: inputDesde.value,
        hasta: inputHasta.value
    };

    if (!nuevaReserva.cliente || !nuevaReserva.telefono) {
        mostrarMensaje("Completá el nombre y el teléfono del cliente.", "error");
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/reservas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaReserva)
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje);
        }

        mostrarMensaje("Reserva registrada correctamente.", "ok");
        resultado.innerHTML = '<p class="sin-resultados">Volvé a buscar para ver la disponibilidad actualizada.</p>';
        cargarReservas();

    } catch (error) {
        mostrarMensaje(`Error: ${error.message}`, "error");
        console.error(error);
    }
}

// ------------------------------------------------------------
// Reservas registradas
// ------------------------------------------------------------
async function cargarReservas() {
    try {
        const respuesta = await fetch(`${API_URL}/reservas`);

        if (!respuesta.ok) {
            throw new Error("Error al obtener reservas");
        }

        const reservas = await respuesta.json();

        listadoReservas.innerHTML = "";

        if (reservas.length === 0) {
            listadoReservas.innerHTML = '<p class="sin-resultados">No hay reservas registradas.</p>';
            return;
        }

        reservas.forEach(reserva => {
            listadoReservas.innerHTML += `
                <div class="reserva">
                    <p><strong>${reserva.cabana}</strong> · ${reserva.cliente} ·
                       ${fechaCorta(reserva.fechaDesde)} → ${fechaCorta(reserva.fechaHasta)}
                       (${reserva.noches} noches)
                       <span class="monto">${formatoPrecio.format(reserva.total)}</span></p>
                    <button data-id="${reserva.idReserva}">Cancelar</button>
                </div>
            `;
        });

    } catch (error) {
        mostrarMensaje("No se pudo conectar con la API.", "error");
        console.error(error);
    }
}

// ------------------------------------------------------------
// DELETE: cancelar (con confirmación, como siempre)
// ------------------------------------------------------------
async function cancelarReserva(idReserva) {
    const seguro = confirm("¿Cancelar esta reserva?");
    if (!seguro) return;

    try {
        const respuesta = await fetch(`${API_URL}/reservas/${idReserva}`, {
            method: "DELETE"
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(data.mensaje);
        }

        mostrarMensaje("Reserva cancelada.", "ok");
        cargarReservas();

    } catch (error) {
        mostrarMensaje(`Error: ${error.message}`, "error");
        console.error(error);
    }
}

// ------------------------------------------------------------
// Delegación de eventos
// ------------------------------------------------------------
resultado.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-id]");
    if (!boton) return;
    reservar(Number(boton.dataset.id));
});

listadoReservas.addEventListener("click", (evento) => {
    const boton = evento.target.closest("button[data-id]");
    if (!boton) return;
    cancelarReserva(Number(boton.dataset.id));
});

// ------------------------------------------------------------
// Utilidades
// ------------------------------------------------------------
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
}

// Eventos e inicialización
formBusqueda.addEventListener("submit", buscarDisponibles);
cargarReservas();
