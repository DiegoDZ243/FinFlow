const express = require('express');
const createRouter = require('./create');
const getAllRouter = require('./getAll');
const deleteRouter = require('./delete');

const router = express.Router();

router.use('/', createRouter);
router.use('/', getAllRouter);
router.use('/', deleteRouter);

module.exports = router;
