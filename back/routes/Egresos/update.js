const express = require('express');
const { actualizarEgreso } = require('../../controllers/egresoController');
const { verificarToken } = require('../../middleware/auth');

const router = express.Router();

router.put('/:id', verificarToken, actualizarEgreso);

module.exports = router;