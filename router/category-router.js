const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');

router.get('/categories', authMiddleware, roleMiddleware, categoryController.getAllCategories);
router.get('/categories/:category_id', authMiddleware, roleMiddleware, categoryController.getCategory);
router.get('/categories/:category_id/posts', authMiddleware, roleMiddleware, categoryController.getCategoryPosts);
router.post('/categories', authMiddleware, roleMiddleware, categoryController.createCategory);
router.patch('/categories/:category_id', authMiddleware, roleMiddleware, categoryController.updateCategory);
router.delete('/categories/:category_id', authMiddleware, roleMiddleware, categoryController.deleteCategory);

module.exports = router;