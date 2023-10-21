const sequelize = require('../db/db');
const userModel = require('../models/user-model')(sequelize);
const UserDto = require('../dtos/user-dto');
class userService {
    async getAllUsers() {
        const users = await userModel.findAll();
        const usersDto = users.map(user => new UserDto(user));
        return { users: usersDto };
    }

    async getUser(userId) {
        const user = await userModel.findOne({ where: { id: userId } });

        if (!user) {
            throw ApiError.BadRequest(`User ${user.login} not found`);
        }

        const userDto = new UserDto(user);

        return { user: userDto };
    }
}

module.exports = new userService();