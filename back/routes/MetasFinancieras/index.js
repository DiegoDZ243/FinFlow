const express = require('express');
const router = express.Router();

const {
    crearMeta,
    obtenerTodasMetas,
    obtenerMetaPorId,
    actualizarMeta,
    eliminarMeta,
    obtenerProgreso,
    aportarMeta
} = require('../../controllers/metaController');

const { verificarToken } = require('../../middleware/auth');

router.get('/', verificarToken, obtenerTodasMetas);
router.get('/:id', verificarToken, obtenerMetaPorId);
router.get('/:id/progreso', verificarToken, obtenerProgreso);
router.post('/', verificarToken, crearMeta);
router.put('/:id', verificarToken, actualizarMeta);
router.delete('/:id', verificarToken, eliminarMeta);
router.post('/:id/aportar', verificarToken, aportarMeta);

module.exports = router;