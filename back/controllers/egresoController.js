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

const idEsValido = (id) => /^\d+$/.test(String(id)) && Number(id) > 0;

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

const obtenerEgresoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        if (!idEsValido(id)) {
            return res.status(400).json({ error: 'Identificador de egreso inválido' });
        }

        const egreso = await models.Egreso.findByPk(Number(id));
        if (!egreso) {
            return res.status(404).json({ error: 'Egreso no encontrado' });
        }
        if (egreso.ahorradorId !== req.user.id) {
            return res.status(403).json({ error: 'No tiene permiso para acceder a este egreso' });
        }

        return res.json(egreso);
    } catch (error) {
        console.error('Error al obtener egreso por id:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const actualizarEgreso = async (req, res) => {
    try {
        const { id } = req.params;
        if (!idEsValido(id)) {
            return res.status(400).json({ error: 'Identificador de egreso inválido' });
        }

        const egreso = await models.Egreso.findByPk(Number(id));
        if (!egreso) {
            return res.status(404).json({ error: 'Egreso no encontrado' });
        }
        if (egreso.ahorradorId !== req.user.id) {
            return res.status(403).json({ error: 'No tiene permiso para actualizar este egreso' });
        }

        const { monto: montoRecibido, fecha, descripcion } = req.body || {};
        const cambios = {};

        if (montoRecibido !== undefined) {
            const monto = Number(montoRecibido);
            if (montoRecibido === null || montoRecibido === '' || !Number.isFinite(monto) || monto <= 0) {
                return res.status(400).json({ error: 'El monto debe ser mayor a 0' });
            }
            cambios.monto = monto;
        }
        if (fecha !== undefined) {
            if (!fechaEsValida(fecha)) {
                return res.status(400).json({ error: 'La fecha debe tener formato YYYY-MM-DD y ser válida' });
            }
            cambios.fecha = fecha;
        }
        if (descripcion !== undefined) {
            if (descripcion !== null && typeof descripcion !== 'string') {
                return res.status(400).json({ error: 'La descripción debe ser texto' });
            }
            cambios.descripcion = typeof descripcion === 'string' ? descripcion.trim() || null : null;
        }
        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({ error: 'Proporciona al menos un campo para actualizar' });
        }

        await egreso.update(cambios);
        return res.json(egreso);
    } catch (error) {
        console.error('Error al actualizar egreso:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    obtenerEgresos,
    obtenerEgresoPorId,
    actualizarEgreso
};