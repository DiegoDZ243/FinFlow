const express = require('express');
const router = express.Router();

router.use('/', require('./getAll'));
router.use('/', require('./getById'));
router.use('/', require('./update'));

module.exports = router;
