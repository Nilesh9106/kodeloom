const express = require('express');
const inviteController = require('../controllers/invite');
const protect = require('../middleware/auth');
const router = express.Router();

router.use(protect);

router.get('/GetByUserId/:userId', inviteController.getInvitesByUserId);
router.get('/GetByProjectId/:projectId', inviteController.getInvitesByProjectId);
router.post('/:id/accept', protect, inviteController.acceptInvite);
router.post('/:id/reject', protect, inviteController.rejectInvite);

module.exports = router;