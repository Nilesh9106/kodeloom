const express = require('express');
const userController = require('../controllers/user');
const protect = require('../middleware/auth');
const router = express.Router();

router.get('/', userController.getAllUser);
router.get('/:username', userController.getUserByUsername);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;