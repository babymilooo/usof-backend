import controller from "../controllers/socketController.js";

export default function socketRouter(io, socket) {
    let userData = {};

    socket.on("getUserData", async (data) => {
        userData = await controller.getUserData(io, socket, data);
    });
}