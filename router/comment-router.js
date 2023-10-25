const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');

router.get('/api/comments/:comment_id', commentController.getCommentData);
router.get('/api/comments/:comment_id/like', commentController.getCommentLikes);
router.post('/api/comments/:comment_id/like', commentController.createLikeForComment);
router.patch('/api/comments/:comment_id', commentController.updateComment);
router.delete('/api/comments/:comment_id', commentController.deleteComment);
router.delete('/api/comments/:comment_id/like', commentController.deleteLikeForComment);

module.exports = router;