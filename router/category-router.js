const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');

router.get('/categories', categoryController.getAllCategories);
router.get('/categories/category_id', categoryController.getCategory);
router.get('/api/categories/:category_id/posts', categoryController.getCategoryPosts);
router.post('/api/categories', categoryController.createCategory);
router.patch('/api/categories/:category_id', categoryController.updateCategory);
router.delete('/api/categories/:category_id', categoryController.deleteCategory);

module.exports = router;