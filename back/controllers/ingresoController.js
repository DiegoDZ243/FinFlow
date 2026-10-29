const { models } = require('../models');

const fechaEsValida = (fecha) => {
	if (typeof fecha !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
		return false;
	}

	const [anio, mes, dia] = fecha.split('-').map(Number);
	const fechaUTC = new Date(Date.UTC(anio, mes - 1, dia));

	return fechaUTC.getUTCFullYear() === anio
		&& fechaUTC.getUTCMonth() === mes - 1
		&& fechaUTC.getUTCDate() === dia;
};

const crearIngreso = async (req, res) => {
	try {
		const { monto: montoRecibido, fecha, descripcion } = req.body || {};
		const monto = Number(montoRecibido);

		if (montoRecibido === undefined || montoRecibido === null || montoRecibido === '' || !Number.isFinite(monto) || monto <= 0) {
			return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
		}

		if (fecha !== undefined && !fechaEsValida(fecha)) {
			return res.status(400).json({ error: 'La fecha debe tener formato YYYY-MM-DD y ser válida' });
		}

		if (descripcion !== undefined && descripcion !== null && typeof descripcion !== 'string') {
			return res.status(400).json({ error: 'La descripción debe ser texto' });
		}

		const datosIngreso = {
			monto,
			descripcion: typeof descripcion === 'string' ? descripcion.trim() || null : null,
			ahorradorId: req.user.id
		};

		if (fecha !== undefined) {
			datosIngreso.fecha = fecha;
		}

		const nuevoIngreso = await models.Ingreso.create(datosIngreso);
		return res.status(201).json(nuevoIngreso);
	} catch (error) {
		console.error('Error al crear ingreso:', error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
};

module.exports = { crearIngreso };
