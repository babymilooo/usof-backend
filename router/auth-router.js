const express = require('express');
const authController = require('../controllers/auth-controller');
const router = express.Router();
const { body } = require('express-validator');

router.post('/register',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    authController.registration
);

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/password-reset', authController.refresh);
router.get('/regenerateToken', authController.regenerateToken);
// router.post('/password-reset/<confirm_token>', someController.someMethod);

module.exports = router;
