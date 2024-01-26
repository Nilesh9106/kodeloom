const express = require('express');
const taskController = require('../controllers/task');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, taskController.createTask);
router.get('/user/:id', auth, taskController.getTasksByUserId);
router.get('/project/:id', auth, taskController.getTasksByProjectId);
router.get('/user/:userId/project/:projectId', auth, taskController.getTasksByUserIdAndProjectId);
router.get('/:id', auth, taskController.getTaskById);
router.put('/:id', auth, taskController.updateTask);
router.delete('/:id', auth, taskController.deleteTask);


module.exports = router;