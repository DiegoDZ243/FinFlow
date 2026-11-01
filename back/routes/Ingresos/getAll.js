const express = require('express');
const router = express.Router();
const { obtenerTodosIngresos } = require('../../controllers/ingresoController');
const { verificarToken } = require('../../middleware/auth');

router.get('/', verificarToken, obtenerTodosIngresos);

module.exports = router;