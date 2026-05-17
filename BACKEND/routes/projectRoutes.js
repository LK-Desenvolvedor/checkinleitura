const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, projectController.createProject);
router.get('/group/:groupId', authMiddleware, projectController.getProjectsByGroup);
router.get('/:projectId', authMiddleware, projectController.getProjectById);
router.put('/:projectId', authMiddleware, projectController.updateProject);
router.post('/:projectId/pause', authMiddleware, projectController.pauseProject);
router.post('/:projectId/reopen', authMiddleware, projectController.reopenProject);
router.delete('/:projectId', authMiddleware, projectController.deleteProject);
router.post('/invitation/respond', authMiddleware, projectController.respondToProjectInvitation);
router.post('/participant/remove', authMiddleware, projectController.removeParticipantFromProject);
router.post('/participant/ban', authMiddleware, projectController.banParticipantFromProject);

module.exports = router;
