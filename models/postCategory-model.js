const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const PostCategory = sequelize.define('PostCategory', {
        postId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Posts',
                key: 'id'
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: 'Categories',
                key: 'id'
            }
        }
    }, {
        sequelize,
        modelName: 'PostCategory',
        tableName: 'PostCategories',
        timestamps: false
    });

    return PostCategory;
};
