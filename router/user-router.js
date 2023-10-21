const express = require('express');
const userController = require('../controllers/user-controller');
const router = express.Router();
const authMeddleware = require('../middlewares/auth-middleware');

router.get('/users', authMeddleware, userController.getUsers);
router.get('/users/:user_id', userController.getUser);

module.exports = router;
