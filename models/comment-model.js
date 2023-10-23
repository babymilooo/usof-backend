const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Comment = sequelize.define('Comment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        author: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users', // имя модели 'User' должно быть задано в вашем определении модели
                key: 'id'
            }
        },
        publish_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        postId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Posts',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'Comment',
        tableName: 'Comments',
        timestamps: false
    });

    return Comment;
};
