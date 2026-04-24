const express = require('express');
const router = express.Router();
const { actualizarMeta } = require('../../controllers/metaController');
const { verificarToken } = require('../../middleware/auth');

router.put('/:id', verificarToken, actualizarMeta);

module.exports = router;