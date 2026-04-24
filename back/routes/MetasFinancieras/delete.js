const express = require('express');
const router = express.Router();
const { eliminarMeta } = require('../../controllers/metaController');
const { verificarToken } = require('../../middleware/auth');

router.delete('/:id', verificarToken, eliminarMeta);

module.exports = router;