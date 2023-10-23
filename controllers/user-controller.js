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

    async createNewUser(req, res, next) {
        try {
            const { login, email, password } = req.body;
            const user = await userService.createNewUser(login, email, password);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    },

    async changeAvatar(req, res, next) {
        try {
            const file = req.file;
            const filePath = file.path;
            await userService.changeAvatar(req.body.id, filePath);
            return res.json({ filePath });
        } catch (e) {
            next(e);
        }
    },

    async changeUserData(req, res, next) {
        try {
            const userId = req.params.user_id;
            const newUserData = req.body;
            const user = await userService.changeUserData(userId, newUserData);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    },

    async deleteUser(req, res, next) {
        try {
            const userId = req.params.user_id;
            const login = await userService.deleteUser(userId);
            return res.status(200).json({ message: `${login} has been deleted` });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = userController;