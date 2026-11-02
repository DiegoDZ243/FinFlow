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

const crearEgreso = async (req, res) => {
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

		const datosEgreso = {
			monto,
			descripcion: typeof descripcion === 'string' ? descripcion.trim() || null : null,
			ahorradorId: req.user.id
		};

		if (fecha !== undefined) {
			datosEgreso.fecha = fecha;
		}

		const nuevoEgreso = await models.Egreso.create(datosEgreso);
		return res.status(201).json(nuevoEgreso);
	} catch (error) {
		console.error('Error al crear egreso:', error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
};

const obtenerEgresos = async (req, res) => {
	try {
		const egresos = await models.Egreso.findAll({
			where: { ahorradorId: req.user.id },
			order: [['fecha', 'DESC'], ['clave', 'DESC']]
		});

		return res.json(egresos);
	} catch (error) {
		console.error('Error al obtener egresos:', error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
};

const eliminarEgreso = async (req, res) => {
	try {
		const clave = Number(req.params?.id);

		if (!Number.isInteger(clave) || clave <= 0) {
			return res.status(400).json({ error: 'Identificador de egreso inválido' });
		}

		const eliminados = await models.Egreso.destroy({
			where: {
				clave,
				ahorradorId: req.user.id
			}
		});

		if (eliminados === 0) {
			return res.status(404).json({ error: 'Egreso no encontrado' });
		}

		return res.json({ mensaje: 'Egreso eliminado correctamente' });
	} catch (error) {
		console.error('Error al eliminar egreso:', error);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
};

module.exports = { crearEgreso, obtenerEgresos, eliminarEgreso };