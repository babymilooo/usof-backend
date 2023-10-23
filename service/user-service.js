const sequelize = require('../db/db');
const userModel = require('../models/user-model')(sequelize);
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');
class userService {
    async getAllUsers() {
        const users = await userModel.findAll();
        const usersDto = users.map(user => new UserDto(user));
        return { users: usersDto };
    }

    async getUser(userId) {
        const user = await userModel.findOne({ where: { id: userId } });
        if (!user) {
            throw ApiError.BadRequest(`User not found`);
        }
        const userDto = new UserDto(user);
        return { user: userDto };
    }

    async createNewUser(login, email, password, role) {
        const candidate = await userModel.findOne({ where: { login } });
        if (candidate) {
            throw ApiError.BadRequest(`User ${login} already exists`);
        }
        const newUser = await userModel.create({ login, password, email, role });
        const userDto = new UserDto(newUser);
        return { user: userDto };
    }

    async changeAvatar(userId, filePath) {
        const user = await userModel.findOne({ where: { id: userId } });
        if (!user) {
            throw ApiError.BadRequest(`User not found`);
        };
        user.profilePicture = filePath;
        await user.save();
    }

    async changeUserData(userId, newUserData) {
        const user = await userModel.findOne({ where: { id: userId } });
        if (!user) {
            throw ApiError.BadRequest(`User not found`);
        };
        await user.update(newUserData);
        return user;
    }

    async deleteUser(userId) {
        const user = await userModel.findOne({ where: { id: userId } });
        if (!user) {
            return false;
        }
        const login = user.login;
        await user.destroy();

        return login;
    }
}

module.exports = new userService();