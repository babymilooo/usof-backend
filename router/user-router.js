const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();
const authMeddleware = require('../middlewares/auth-middleware');
const upload = require('../service/file-service');

router.get('/users', authMeddleware, userController.getUsers);
router.get('/users/:user_id', authMeddleware, userController.getUser);
router.post('/users', authMeddleware, userController.createNewUser);
router.patch('/users/avatars', authMeddleware, upload.single('avatar'), userController.changeAvatar);
router.patch('/users/:user_id', authMeddleware, userController.changeUserData);
router.delete('/users/:user_id', authMeddleware, userController.deleteUser);
module.exports = router;
