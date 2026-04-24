const express = require('express');
const router = express.Router();
const { obtenerMetaPorId } = require('../../controllers/metaController');
const { verificarToken } = require('../../middleware/auth');

router.get('/:id', verificarToken, obtenerMetaPorId);

module.exports = router;