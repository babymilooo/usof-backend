const sequelize = require('../db/db');
const userModel = require('../models/user-model')(sequelize);

class userService {
    async getAllUsers() {
        const users = await userModel.findAll();
        return users;
    }
}

module.exports = new userService();