const express = require('express');
const userController = require('../controllers/user');
const protect = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.get('/', userController.searchUser);
router.get('/:username', userController.getUserByUsername);
router.put('/:id', protect, userController.updateUser);
router.delete('/:id', protect, userController.deleteUser);

module.exports = router;