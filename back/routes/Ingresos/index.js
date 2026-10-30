const express = require('express');
const createRouter = require('./create');
const getAllRouter = require('./getAll');
const getByIdRouter = require('./getById');
const deleteRouter = require('./delete');

const router = express.Router();

router.use('/', getAllRouter);
router.use('/', getByIdRouter);
router.use('/', createRouter);
router.use('/', deleteRouter);

module.exports = router;
