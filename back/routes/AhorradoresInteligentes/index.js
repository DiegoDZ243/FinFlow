const express = require('express');
const router = express.Router();

const { registrarAhorrador } = require('./registrar');
const { loginAhorrador } = require('./login');

router.post('/registrar', registrarAhorrador);
router.post('/login', loginAhorrador);

module.exports = router;