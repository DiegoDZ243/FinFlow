const express = require('express');
const { eliminarEgreso } = require('../../controllers/egresoController');
const { verificarToken } = require('../../middleware/auth');

const router = express.Router();

router.delete('/:id', verificarToken, eliminarEgreso);

module.exports = router;
