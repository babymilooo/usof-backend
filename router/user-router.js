const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');
const roleMiddleware = require('../middlewares/role-middleware');
const upload = require('../service/file-service');

router.get('/users', authMiddleware, roleMiddleware, userController.getUsers);
router.get('/users/:user_id', authMiddleware, roleMiddleware, userController.getUser);
router.post('/users', authMiddleware, roleMiddleware, userController.createNewUser);
router.patch('/users/avatars', authMiddleware, upload.single('avatar'), roleMiddleware, userController.changeAvatar);
router.patch('/users/:user_id', authMiddleware, roleMiddleware, userController.changeUserData);
router.delete('/users/:user_id', authMiddleware, roleMiddleware, userController.deleteUser);
module.exports = router;
