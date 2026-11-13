const express = require('express');
const getAllRouter = require('./getAll');
const getByIdRouter = require('./getById');
const updateRouter = require('./update');

const router = express.Router();

router.use('/', getAllRouter);
router.use('/', getByIdRouter);
router.use('/', updateRouter);

module.exports = router;
