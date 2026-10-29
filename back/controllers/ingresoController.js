const { Op } = require('sequelize');
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

const obtenerIngresos = async (req, res) => {
	try {
		const ahorradorId = req.user.id;
		const { fechaInicio, fechaFin } = req.query || {};

		if (fechaInicio !== undefined && !fechaEsValida(fechaInicio)) {
			return res.status(400).json({ error: 'La fecha de inicio debe tener formato YYYY-MM-DD y ser válida' });
		}

		if (fechaFin !== undefined && !fechaEsValida(fechaFin)) {
			return res.status(400).json({ error: 'La fecha de fin debe tener formato YYYY-MM-DD y ser válida' });
		}

		if (fechaInicio !== undefined && fechaFin !== undefined && fechaInicio > fechaFin) {
			return res.status(400).json({ error: 'La fecha de inicio no puede ser posterior a la fecha de fin' });
		}

		const where = { ahorradorId };

		if (fechaInicio !== undefined || fechaFin !== undefined) {
			where.fecha = {};
			if (fechaInicio !== undefined) {
				where.fecha[Op.gte] = new Date(`${fechaInicio}T00:00:00.000Z`);
			}
			if (fechaFin !== undefined) {
				where.fecha[Op.lte] = new Date(`${fechaFin}T23:59:59.999Z`);
			}
		}

		const ingresos = await models.Ingreso.findAll({
			where,
			order: [['fecha', 'DESC'], ['clave', 'DESC']]
		});

		return res.json(ingresos);
	} catch (error) {
		console.error('Error al obtener ingresos:', error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
};

const obtenerIngresoPorId = async (req, res) => {
	try {
		const clave = Number(req.params?.id);
		const ahorradorId = req.user.id;

		if (!Number.isInteger(clave) || clave <= 0) {
			return res.status(400).json({ error: 'Identificador de ingreso inválido' });
		}

		const ingreso = await models.Ingreso.findByPk(clave);

		if (!ingreso) {
			return res.status(404).json({ error: 'Ingreso no encontrado' });
		}

		if (ingreso.ahorradorId !== ahorradorId) {
			return res.status(403).json({ error: 'No tiene permiso para acceder a este ingreso' });
		}

		return res.json(ingreso);
	} catch (error) {
		console.error('Error al obtener ingreso por id:', error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
};

module.exports = {
	crearIngreso,
	obtenerIngresos,
	obtenerIngresoPorId
};
