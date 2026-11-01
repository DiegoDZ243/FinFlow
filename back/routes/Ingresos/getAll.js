const express = require('express');
const { obtenerIngresos } = require('../../controllers/ingresoController');
const { verificarToken } = require('../../middleware/auth');

const router = express.Router();

router.get('/', verificarToken, obtenerIngresos);

module.exports = router;
