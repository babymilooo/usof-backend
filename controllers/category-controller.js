const e = require('express');
const categoryService = require('../service/category-service');
const ApiError = require('../exceptions/api-error');

const categoryController = {
    async getAllCategories(req, res, next) {
        try {
            const categories = await categoryService.getAllCategories();
            res.status(200).json(categories);
        } catch (e) {
            next(e);
        }
    },

    async getCategory(req, res, next) {
        try {
            const categoryId = req.params.category_id;
            const category = await categoryService.getCategoryById(categoryId);

            if (!category) {
                throw ApiError.NotFound('Category not found');
            }

            res.status(200).json(category);
        } catch (e) {
            next(e);
        }
    },

    async getCategoryPosts(req, res, next) {
        try {
            const categoryId = req.params.category_id;
            const posts = await categoryService.getCategoryPosts(categoryId);

            res.status(200).json(posts);
        } catch (e) {
            next(e);
        }
    },

    async createCategory(req, res, next) {
        try {
            const { title } = req.body;
            if (!title) {
                return res.status(400).json({ message: "Title is required" });
            }

            const newCategory = await categoryService.createCategory({ title });

            res.status(201).json(newCategory);
        } catch (e) {
            next(e);
        }
    },

    async updateCategory(req, res, next) {
        try {
            const categoryId = req.params.category_id;
            const updatedCategory = await categoryService.updateCategory(categoryId, req.body);

            if (updatedCategory[0] === 0) {  // number of updated entities
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json({ message: 'Category updated successfully' });
        } catch (e) {
            next(e);
        }
    },

    async deleteCategory(req, res, next) {
        try {
            const categoryId = req.params.category_id;
            const deleted = await categoryService.deleteCategory(categoryId);

            if (!deleted) {
                return res.status(404).json({ message: 'Category not found' });
            }

            res.status(200).json({ message: 'Category deleted successfully' });
        } catch (e) {
            next(e);
        }
    }

}

module.exports = categoryController;
