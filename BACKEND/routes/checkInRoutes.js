const express = require('express');
const router = express.Router();
const checkInController = require('../controllers/checkInController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, checkInController.createCheckIn);
router.get('/project/:projectId', authMiddleware, checkInController.getCheckInsByProject);
router.get('/project/:projectId/user', authMiddleware, checkInController.getCheckInsByUser);
router.get('/:checkInId', authMiddleware, checkInController.getCheckInById);
router.put('/:checkInId', authMiddleware, checkInController.updateCheckIn);
router.delete('/:checkInId', authMiddleware, checkInController.deleteCheckIn);
router.get('/project/:projectId/progress', authMiddleware, checkInController.getProjectProgress);

module.exports = router;
