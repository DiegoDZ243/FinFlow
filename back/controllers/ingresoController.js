const { models } = require('../models');

const { Ingreso } = models;

const idValido = (id) => /^\d+$/.test(id) && Number(id) > 0;

const obtenerTodosIngresos = async (req, res) => {
    try {
        const ingresos = await Ingreso.findAll({
            where: { ahorradorId: req.user.id },
            order: [['fecha', 'DESC'], ['clave', 'DESC']]
        });
        res.json(ingresos);
    } catch (error) {
        console.error('Error al obtener ingresos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const obtenerIngresoPorId = async (req, res) => {
    try {
        if (!idValido(req.params.id)) {
            return res.status(400).json({ error: 'El identificador del ingreso no es válido' });
        }

        const ingreso = await Ingreso.findByPk(req.params.id);

        if (!ingreso) {
            return res.status(404).json({ error: 'Ingreso no encontrado' });
        }
        if (ingreso.ahorradorId !== req.user.id) {
            return res.status(403).json({ error: 'No tiene permiso para acceder a este ingreso' });
        }

        res.json(ingreso);
    } catch (error) {
        console.error('Error al obtener ingreso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const actualizarIngreso = async (req, res) => {
    try {
        if (!idValido(req.params.id)) {
            return res.status(400).json({ error: 'El identificador del ingreso no es válido' });
        }

        const ingreso = await Ingreso.findByPk(req.params.id);

        if (!ingreso) {
            return res.status(404).json({ error: 'Ingreso no encontrado' });
        }
        if (ingreso.ahorradorId !== req.user.id) {
            return res.status(403).json({ error: 'No tiene permiso para actualizar este ingreso' });
        }

        const { monto, fecha, descripcion } = req.body;
        const cambios = {};

        if (monto !== undefined) {
            const montoNumerico = Number(monto);
            if (!Number.isFinite(montoNumerico) || montoNumerico <= 0) {
                return res.status(400).json({ error: 'El monto debe ser un número mayor a 0' });
            }
            cambios.monto = montoNumerico;
        }

        if (fecha !== undefined) {
            const fechaValida = new Date(fecha);
            if (Number.isNaN(fechaValida.getTime())) {
                return res.status(400).json({ error: 'La fecha proporcionada no es válida' });
            }
            cambios.fecha = fechaValida;
        }

        if (descripcion !== undefined) {
            if (descripcion !== null && typeof descripcion !== 'string') {
                return res.status(400).json({ error: 'La descripción debe ser texto' });
            }
            cambios.descripcion = descripcion;
        }

        if (Object.keys(cambios).length === 0) {
            return res.status(400).json({ error: 'Proporciona al menos un campo para actualizar' });
        }

        await ingreso.update(cambios);
        res.json(ingreso);
    } catch (error) {
        console.error('Error al actualizar ingreso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { obtenerTodosIngresos, obtenerIngresoPorId, actualizarIngreso };