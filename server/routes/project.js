const express = require('express');
const projectController = require('../controllers/project');
const auth = require('../middleware/auth');

const router = express.Router();
router.use(auth);
router.post('/', projectController.createProject);
router.get('/user/:id', projectController.getProjectsByUserId);
router.post('/:id/addMember', projectController.addMember);
router.post('/:id/removeMember', projectController.removeMember);
router.get('/:id', projectController.getProjectById);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;