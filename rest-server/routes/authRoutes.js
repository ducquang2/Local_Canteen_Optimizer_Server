const express = require('express');
const { authorize, checkPermissions } = require('../controllers/authController');

const router = express.Router();

router.post('/auth', authorize);

module.exports = router;