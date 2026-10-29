const express = require('express');
const createRouter = require('./create');

const router = express.Router();

router.use('/', createRouter);

module.exports = router;