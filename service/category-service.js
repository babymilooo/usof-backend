const sequelize = require('../db/db');
const categoryModel = require('../models/category-model')(sequelize);
const postCategoryModel = require('../models/postCategory-model')(sequelize);
const postModel = require('../models/post-model')(sequelize);

postModel.belongsToMany(categoryModel, { through: 'PostCategory', foreignKey: 'postId', otherKey: 'categoryId', as: 'postsCategories' });
categoryModel.belongsToMany(postModel, { through: 'PostCategory', foreignKey: 'categoryId', otherKey: 'postId', as: 'postsCategories' });

class CategoryService {
    async getAllCategories() {
        return await categoryModel.findAll();
    }

    async getCategoryById(categoryId) {
        return await categoryModel.findByPk(categoryId);
    }

    async getCategoryPosts(categoryId) {
        return await postModel.findAll({
            include: [{
                model: categoryModel,
                as: 'postsCategories',
                through: {
                    model: postCategoryModel,
                    where: { categoryId: categoryId }
                },
                required: true
            }]
        });
    }

    async createCategory(data) {
        return await categoryModel.create(data);
    }

    async updateCategory(id, data) {
        return await categoryModel.update(data, {
            where: { id: id }
        });
    }

    async deleteCategory(id) {
        return await categoryModel.destroy({
            where: { id: id }
        });
    }
}

module.exports = new CategoryService();