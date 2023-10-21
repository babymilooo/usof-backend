const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sequelize = require('../db/db');
const tokenModel = require('../models/token-model')(sequelize);
const resetTokenModel = require('../models/resetToken-model')(sequelize);
const userModel = require('../models/user-model')(sequelize);
class tokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({ where: { user_id: userId } });
        if (tokenData) {
            tokenData.token = refreshToken;
            return tokenData.save();
        }
        try {
            const token = await tokenModel.create({
                user_id: userId,
                token: refreshToken,
            });

            return token;
        } catch (error) {
            throw new Error('Database error: ' + error.message);
        }
    }

    async saveResetToken(email, token) {
        try {
            const existingToken = await resetTokenModel.findOne({ where: { email } });

            if (existingToken) {
                return existingToken.update({ token, created_at: new Date() });
            } else {
                return resetTokenModel.create({ email, token, created_at: new Date() });
            }
        } catch (error) {
            console.error('Ошибка при сохранении токена сброса пароля:', error);
            throw error;
        }
    }

    async generatePasswordResetToken(email) {
        const user = await userModel.findOne({ where: { email } });

        if (!user) {
            return null;
        }

        // Создаем уникальный токен сброса пароля
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');

        // Устанавливаем токен и срок его действия в базе данных
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = Date.now() + 3600000; // токен действителен 1 час

        await user.save();

        return user;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.destroy({ where: { token: refreshToken } });
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({ where: { token: refreshToken } });
        return tokenData;
    }
}

module.exports = new tokenService();