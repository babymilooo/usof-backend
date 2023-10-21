require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./db/db');
const authRouter = require('./router/auth-router');
const userRouter = require('./router/user-router');
const errorMiddleware = require('./middlewares/error-middleware');
const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api', userRouter);
app.use(errorMiddleware);

const start = async () => {
    try {
        if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASS || !process.env.DB_HOST) {
            console.error('Missing necessary environment variables for database connection');
            process.exit(1);
        }
        await sequelize.authenticate();
        app.listen(PORT, () => console.log(`Server is running on port http://127.0.0.1:${PORT}`));
    } catch (e) {
        console.error('Unable to connect to the database:', e);
    }
}

// Добавляем обработку событий завершения работы
process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);

async function handleExit(signal) {
    console.log(`Received ${signal}. Close server and database connection..`);
    app.close(async () => {
        console.log('HTTP server closed.');
        try {
            await sequelize.close();
            console.log('Database connection closed.');
            process.exit(0);
        } catch (error) {
            console.error('Error occurred when closing the database connection:', error);
            process.exit(1);
        }
    });
}

start();