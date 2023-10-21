const userService = require("../service/user-service");

const userController = {
    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    },

    async getUser(req, res, next) {
        try {
            const userId = req.params.user_id;
            const user = await userService.getUser(userId);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    },

}

module.exports = userController;