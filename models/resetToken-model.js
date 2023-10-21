const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const resetToken = sequelize.define('ResetToken', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }, {
        sequelize,
        modelName: 'ResetToken',
        tableName: 'password_resets',
        timestamps: false
    });

    return resetToken;
}