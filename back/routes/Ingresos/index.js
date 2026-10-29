const express = require('express');
const createRouter = require('./create');
const getAllRouter = require('./getAll');
const getByIdRouter = require('./getById');

const router = express.Router();

router.use('/', getAllRouter);
router.use('/', getByIdRouter);
router.use('/', createRouter);

module.exports = router;
