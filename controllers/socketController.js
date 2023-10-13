import jsonwebtoken from "jsonwebtoken";

import config from "../config.json" assert { type: 'json' };

export default class socketController {
    static async getUserData(io, socket, data) {
        try {
            const newUser = new User();
            const { id } = await jsonwebtoken.verify(data, config.jswt.secretKey);

            await newUser.find(id);
            const userData = {
                login: newUser.login,
                id: newUser.id,
                picture: newUser.picture_path,
            };

            socket.emit("userData", userData);

            userData.socket = socket;
            userData.roomNbr = -1;
            userData.hp = 30;
            userData.mana = 2;
            userData.cards = 27;

            return userData;
            } catch (err) {
                throw err;
            }
    }
}
