import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
import { createServer } from 'http';
import config from "./config.json" assert { type: 'json' };
import authRouter from "./routes/expressRouter.js";
import socketRouter from "./routes/socketRouter.js";

const port = config.port || 8000;
const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.resolve('public')));
app.use(express.static(path.resolve('resources')));

app.use(authRouter);

app.use((req, res, next)=>{
  res.status(404).send("Not Found");
});

io.on('connection', (socket) => {
  socketRouter(io, socket);
});

server.listen(port, () => {
    console.log(`Server started at http://127.0.0.1:${port}`);
});