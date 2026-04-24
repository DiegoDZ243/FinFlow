const express = require('express');
const router = express.Router();
const { crearMeta } = require('../../controllers/metaController');
const { verificarToken } = require('../../middleware/auth');

router.post('/', verificarToken, crearMeta);

module.exports = router;