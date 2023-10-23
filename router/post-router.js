const express = require('express');
const router = express.Router();
const postController = require('../controllers/post-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');

router.get('/posts', authMiddleware, postController.getAllPosts);
router.get('/posts/:post_id',authMiddleware, postController.getPost);
router.get('/posts/:post_id/comments', authMiddleware, postController.getAllCommentsForPost);
router.post('/posts/:post_id', authMiddleware, postController.CreateComment);
router.get('/posts/:post_id/categories', authMiddleware, postController.getAllCategoriesForPost);
router.get('/posts/:post_id/like', authMiddleware, postController.getAllLikesForPost);
router.post('/posts', authMiddleware, postController.createPost);
router.post('/posts/:post_id/like', authMiddleware, postController.LikePost);
router.patch('/posts/:post_id', authMiddleware, postController.UpdatePost);
router.delete('/posts/:post_id', authMiddleware, postController.DeletePost);
router.delete('/posts/:post_id/like', authMiddleware, postController.DeleteLike);

module.exports = router;