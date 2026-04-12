const { models } = require('../models');
const { Meta, PlanDeAhorro, Ahorrador } = models;

const crearMeta = async (req, res) => {
    try {
        const { identificador, montoObjetivo, montoAlcanzado, fechaInicio, fechaLimite, descripcion, ahorradorId } = req.body;

        if (!identificador || !montoObjetivo || !fechaInicio || !fechaLimite) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben ser proporcionados' });
        }

        const nuevaMeta = await Meta.create({
            identificador,
            montoObjetivo,
            montoAlcanzado: montoAlcanzado || 0,
            fechaInicio,
            fechaLimite,
            descripcion,
            ahorradorId
        });

        res.status(201).json(nuevaMeta);
    } catch (error) {
        console.error('Error al crear meta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const obtenerTodasMetas = async (req, res) => {
    try {
        const metas = await Meta.findAll();
        res.json(metas);
    } catch (error) {
        console.error('Error al obtener metas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const obtenerMetaPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const meta = await Meta.findByPk(id);

        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        res.json(meta);
    } catch (error) {
        console.error('Error al obtener meta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const actualizarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const { identificador, montoObjetivo, montoAlcanzado, fechaInicio, fechaLimite, descripcion, estado } = req.body;

        const meta = await Meta.findByPk(id);

        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        await meta.update({
            identificador: identificador || meta.identificador,
            montoObjetivo: montoObjetivo || meta.montoObjetivo,
            montoAlcanzado: montoAlcanzado !== undefined ? montoAlcanzado : meta.montoAlcanzado,
            fechaInicio: fechaInicio || meta.fechaInicio,
            fechaLimite: fechaLimite || meta.fechaLimite,
            descripcion: descripcion !== undefined ? descripcion : meta.descripcion,
            estado: estado !== undefined ? estado : meta.estado
        });

        res.json(meta);
    } catch (error) {
        console.error('Error al actualizar meta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const eliminarMeta = async (req, res) => {
    try {
        const { id } = req.params;

        const meta = await Meta.findByPk(id);

        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        await meta.destroy();

        res.json({ message: 'Meta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar meta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const obtenerProgreso = async (req, res) => {
    try {
        const { id } = req.params;

        const meta = await Meta.findByPk(id);

        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        const progreso = parseFloat(meta.montoAlcanzado);
        const objetivo = parseFloat(meta.montoObjetivo);
        const porcentaje = objetivo > 0 ? (progreso / objetivo) * 100 : 0;

        res.json({
            metaId: meta.clave,
            montoAlcanzado: progreso,
            montoObjetivo: objetivo,
            porcentaje: parseFloat(porcentaje.toFixed(2)),
            faltan: Math.max(0, objetivo - progreso)
        });
    } catch (error) {
        console.error('Error al obtener progreso:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const aportarMeta = async (req, res) => {
    try {
        const { id } = req.params;
        const { monto } = req.body;

        if (!monto || monto <= 0) {
            return res.status(400).json({ error: 'Monto debe ser mayor a 0' });
        }

        const meta = await Meta.findByPk(id);

        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        const nuevoMonto = parseFloat(meta.montoAlcanzado) + parseFloat(monto);
        await meta.update({ montoAlcanzado: nuevoMonto });

        const progreso = parseFloat(meta.montoObjetivo);
        const porcentaje = progreso > 0 ? (nuevoMonto / progreso) * 100 : 0;

        res.json({
            message: 'Aporte realizado correctamente',
            meta: {
                id: meta.clave,
                montoAlcanzado: nuevoMonto,
                montoObjetivo: meta.montoObjetivo,
                porcentaje: parseFloat(porcentaje.toFixed(2))
            }
        });
    } catch (error) {
        console.error('Error al aportar:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const crearPlanDeAhorro = async (req, res) => {
    try {
        const { metaId, montoMensual, mesesEstimados, fechaInicio } = req.body;

        if (!metaId || !montoMensual || !mesesEstimados || !fechaInicio) {
            return res.status(400).json({ error: 'Todos los campos requeridos deben ser proporcionados' });
        }

        const meta = await Meta.findByPk(metaId);
        if (!meta) {
            return res.status(404).json({ error: 'Meta no encontrada' });
        }

        const plan = await PlanDeAhorro.create({
            metaId,
            montoMensual,
            mesesEstimados,
            fechaInicio
        });

        res.status(201).json(plan);
    } catch (error) {
        console.error('Error al crear plan de ahorro:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const obtenerPlanDeMeta = async (req, res) => {
    try {
        const { id } = req.params;

        const plan = await PlanDeAhorro.findAll({
            where: { metaId: id },
            include: [{ model: Meta, as: 'meta' }]
        });

        res.json(plan);
    } catch (error) {
        console.error('Error al obtener plan:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    crearMeta,
    obtenerTodasMetas,
    obtenerMetaPorId,
    actualizarMeta,
    eliminarMeta,
    obtenerProgreso,
    aportarMeta,
    crearPlanDeAhorro,
    obtenerPlanDeMeta
};