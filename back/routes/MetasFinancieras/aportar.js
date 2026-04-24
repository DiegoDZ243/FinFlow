const express = require('express');
const router = express.Router();
const { aportarMeta } = require('../../controllers/metaController');
const { verificarToken } = require('../../middleware/auth');

router.post('/:id/aportar', verificarToken, aportarMeta);

module.exports = router;