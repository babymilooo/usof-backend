const e = require('express');
const ApiError = require('../exceptions/api-error');
const categoryModel = require('../models/category-model');
const commentModel = require('../models/comment-model');
const likeModel = require('../models/like-model');
const postModel = require('../models/post-model');
const postCategoryModel = require('../models/postCategory-model');

const postController = {
    async getAllPosts(req, res, next) {
        try {
            res.status(200).send('AllPosts');
        } catch (e) {
            next(e);
        }
    },

    async getPost(req, res, next) {
        try {
            res.status(200).send('Post');
        } catch (e) {
            next(e);
        }
    },

    async getAllCommentsForPost(req, res, next) {
        try {
            res.status(200).send('getAllCommentsForPost');
        } catch (e) {
            next(e);
        }
    },

    async CreateComment(req, res, next) {
        try {
            res.status(200).send('getAllCommentsForPost');
        } catch (e) {
            next(e);
        }
    },

    async getAllCategoriesForPost(req, res, next) {
        try {
            res.status(200).send('getAllCategories');
        } catch (e) {
            next(e);
        }
    },

    async getAllLikesForPost(req, res, next) {
        try {
            res.status(200).send('getAllLikesForPost');
        } catch (e) {
            next(e);
        }
    },

    async createPost(req, res, next) {
        try {
            res.status(200).send('createPost');
        } catch (e) {
            next(e);
        }
    },


    async LikePost(req, res, next) {
        try {
            res.status(200).send('LikePost');
        } catch (e) {
            next(e);
        }
    },

    async UpdatePost(req, res, next) {
        try {
            res.status(200).send('UpdatePost');
        } catch (e) {
            next(e);
        }
    },

    async DeletePost(req, res, next) {
        try {
            res.status(200).send('DeletePost');
        } catch (e) {
            next(e);
        }
    },

    async DeleteLike(req, res, next) {
        try {
            res.status(200).send('DeleteLike');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = postController;