const e = require('express');
const authService = require('../service/auth-service');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error');

const authController = {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation error', errors.array()));
            }
            const { login, email, fullName, password } = req.body;
            const userData = await authService.registration(login, email, fullName, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    },

    async login(req, res, next) {
        try {
            const { login, password } = req.body;
            const userData = await authService.login(login, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    },

    async logout(req, res, next) {
        try {
            const {refreshToken} =req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    },

    async refresh(req, res, next) {
        try {
            const { email } = req.body;
            if (authService.refresh(email)) {
                res.status(200).send('Ссылка для сброса пароля отправлена на вашу электронную почту.');
            }
        } catch (e) {
            next(e);
        }
    },

    async regenerateToken (req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await authService.regenerateToken(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    },

}

module.exports = authController;