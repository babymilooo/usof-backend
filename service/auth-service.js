const { error } = require('console');
const sequelize = require('../db/db');
const UserDto = require('../dtos/user-dto');
const bcrypt = require('bcrypt');
const userModel = require('../models/user-model')(sequelize);
const tokenService = require('./token-service');
const mailServise = require('./mail-service');
const ApiError = require('../exceptions/api-error');
class authService {
    async registration(login, email, fullName, password) {
        const candidate = await userModel.findOne({ where: { login } });
        if (candidate) {
            throw ApiError.BadRequest(`User ${login} already exists`);
        }

        const newUser = await userModel.create({ login, password, fullName, email });

        const userDto = new UserDto(newUser);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    async refresh(email) {
        const user = await tokenService.generatePasswordResetToken(email);
        if (user) {
            const link = `${process.env.API_URL}/password-reset/${user.resetPasswordToken}`;
            await mailServise.sendRefreshPassword(email, link);

            await tokenService.saveResetToken(email, user.resetPasswordToken);
        } else {
            throw ApiError.BadRequest('Пользователь с указанной электронной почтой не найден.');
        }

        return 0;
    }

    async login(login, password) {
        const user = await userModel.findOne({ login });
        if (!user) {
            throw ApiError.BadRequest(`User ${login} not registered`);
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest(`Incorrect password`);
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async regenerateToken(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await userModel.findOne({ where: { id: userData.id } });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }
}

module.exports = new authService();