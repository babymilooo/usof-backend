const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Like = sequelize.define('Like', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // имя модели 'User' должно быть задано в вашем определении модели
                key: 'id'
            }
        },
        entity_Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        entity_type: {
            type: DataTypes.ENUM('comment', 'post'),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('like', 'dislike'),
            allowNull: false
        },
        publish_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'Like',
        tableName: 'Likes',
        timestamps: false
    });

    return Like;
};
