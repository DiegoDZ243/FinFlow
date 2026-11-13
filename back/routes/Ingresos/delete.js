const express = require('express');
const { eliminarIngreso } = require('../../controllers/ingresoController');
const { verificarToken } = require('../../middleware/auth');

const router = express.Router();

router.delete('/:id', verificarToken, eliminarIngreso);

module.exports = router;