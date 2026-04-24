const express = require('express');
const router = express.Router();
const { obtenerTodasMetas } = require('../../controllers/metaController');
const { verificarToken } = require('../../middleware/auth');

router.get('/', verificarToken, obtenerTodasMetas);

module.exports = router;