const express = require('express');
const taskController = require('../controllers/task');

const router = express.Router();

router.post('/', taskController.createTask);
router.get('/user/:id', taskController.getTasksByUserId);
router.get('/project/:id', taskController.getTasksByProjectId);
router.get('/user/:userId/project/:projectId', taskController.getTasksByUserIdAndProjectId);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);


module.exports = router;