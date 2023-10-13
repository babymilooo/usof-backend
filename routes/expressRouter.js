import express from "express";
import { checkToken } from "../utils/utils.js";

import controller from "../controllers/expressController.js";

const router = express.Router();

router.get('/', checkToken, controller.menu);
router.get('/signup', controller.signup);
router.post('/signup', controller.registration);
router.get('/login', controller.login);
router.post('/login', controller.loginUser);
router.get('/logout', checkToken, controller.logout);
// напоминание пароля
// router.post('/upload', checkToken, controller.updatePhoto);

export default router;