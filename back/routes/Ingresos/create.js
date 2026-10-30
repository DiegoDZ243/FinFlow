const express = require('express');
const { crearIngreso } = require('../../controllers/ingresoController');
const { verificarToken } = require('../../middleware/auth');

const router = express.Router();

router.post('/', verificarToken, crearIngreso);

module.exports = router;
