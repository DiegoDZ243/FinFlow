const express = require('express');
const router = express.Router();
const { obtenerProgreso } = require('../../controllers/metaController');
const { verificarToken } = require('../../middleware/auth');

router.get('/:id/progreso', verificarToken, obtenerProgreso);

module.exports = router;