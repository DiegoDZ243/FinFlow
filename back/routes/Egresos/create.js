const express = require('express');
const { crearEgreso } = require('../../controllers/egresoController');
const { verificarToken } = require('../../middleware/auth');

const router = express.Router();

router.post('/', verificarToken, crearEgreso);

module.exports = router;