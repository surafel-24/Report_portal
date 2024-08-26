const express = require('express');
const router = express.Router();
const { handleFilterRequest } = require('../controllers/filter.controller');

router.post('/:dbName/tables/:tableName/filter', handleFilterRequest);

module.exports = router;
