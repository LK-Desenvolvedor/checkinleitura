const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, groupController.createGroup);
router.get('/', authMiddleware, groupController.getMyGroups);
router.get('/:groupId', authMiddleware, groupController.getGroupById);
router.put('/:groupId', authMiddleware, groupController.updateGroup);
router.post('/invite', authMiddleware, groupController.inviteUserToGroup);
router.post('/invitation/respond', authMiddleware, groupController.respondToInvitation);
router.post('/member/remove', authMiddleware, groupController.removeMemberFromGroup);
router.post('/member/ban', authMiddleware, groupController.banMemberFromGroup);
router.post('/member/promote-admin', authMiddleware, groupController.promoteToAdmin);
router.post('/member/promote-creator', authMiddleware, groupController.promoteToCreator);

module.exports = router;
