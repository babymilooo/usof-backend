const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS,
    {
        dialect: "mysql",
        storage: process.env.DB_HOST
    }
)

sequelize.authenticate()
    .then(() => console.log('Connection to the database has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
