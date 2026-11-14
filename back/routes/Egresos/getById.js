const express = require('express');
const { obtenerEgresoPorId } = require('../../controllers/egresoController');
const { verificarToken } = require('../../middleware/auth');

const router = express.Router();

router.get('/:id', verificarToken, obtenerEgresoPorId);

module.exports = router;
