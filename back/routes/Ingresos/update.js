const express = require('express');
const router = express.Router();
const { actualizarIngreso } = require('../../controllers/ingresoController');
const { verificarToken } = require('../../middleware/auth');

router.put('/:id', verificarToken, actualizarIngreso);

module.exports = router;