const express = require('express');
const userController = require('../controllers/userController');
const { checkSupervisorPermission } = require('../middlewares/permissions');
const { authenticateToken } = require('../middlewares/permissions');

const router = express.Router();

router.get('/users', checkSupervisorPermission, userController.getAllUsers);

router.post('/users', authenticateToken, userController.addUser);
router.put('/users/:username', authenticateToken, userController.updateUser);

module.exports = router;