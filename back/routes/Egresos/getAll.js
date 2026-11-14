const express = require('express');
const { obtenerEgresos } = require('../../controllers/egresoController');
const { verificarToken } = require('../../middleware/auth');

const router = express.Router();

router.get('/', verificarToken, obtenerEgresos);

module.exports = router;
