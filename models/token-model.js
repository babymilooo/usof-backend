const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const RefreshToken = sequelize.define('RefreshToken', {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: 'users', // это ссылка на вашу таблицу пользователей
              key: 'id'
            }
          },
          token: {
            type: DataTypes.STRING,
            allowNull: false
          },
        }, {
          sequelize,
          modelName: 'RefreshToken',
          tableName: 'refresh_tokens',
          timestamps: false
    })

    return RefreshToken;
};
