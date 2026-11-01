const express = require('express');
const router = express.Router();
const { obtenerIngresoPorId } = require('../../controllers/ingresoController');
const { verificarToken } = require('../../middleware/auth');

router.get('/:id', verificarToken, obtenerIngresoPorId);

module.exports = router;