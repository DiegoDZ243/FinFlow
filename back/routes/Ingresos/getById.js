const express = require('express');
const { obtenerIngresoPorId } = require('../../controllers/ingresoController');
const { verificarToken } = require('../../middleware/auth');

const router = express.Router();

router.get('/:id', verificarToken, obtenerIngresoPorId);

module.exports = router;
