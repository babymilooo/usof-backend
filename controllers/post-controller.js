const e = require('express');
const postService = require('../service/post-service');

const postController = {
    async getAllPosts(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const posts = await postService.getAllPosts(token);
            res.status(200).json(posts);
        } catch (e) {
            next(e);
        }
    },

    async getPost(req, res, next) {
        try {
            const postId = req.params.post_id;
            console.log(postId);
            const post = await postService.getPost(postId);
            res.status(200).json(post);
        } catch (e) {
            next(e);
        }
    },

    async getAllCommentsForPost(req, res, next) {
        try {
            const postId = req.params.post_id;
            const comments = await postService.getAllCommentsForPost(postId);
            res.status(200).json(comments);
        } catch (e) {
            next(e);
        }
    },

    async CreateComment(req, res, next) {
        try {
            const postId = req.params.post_id;
            const token = req.headers.authorization.split(' ')[1];
            const { content } = req.body;
            const comment = await postService.CreateComment(postId, token, content);
            res.status(200).json(comment);
        } catch (e) {
            next(e);
        }
    },

    async getAllCategoriesForPost(req, res, next) {
        try {
            const postId = req.params.post_id;
            categories = await postService.getAllCategoriesForPost(postId);
            res.status(200).json(categories);
        } catch (e) {
            next(e);
        }
    },

    async getAllLikesForPost(req, res, next) {
        try {
            const postId = req.params.post_id;
            const likes = await postService.getAllLikesForPost(postId);
            res.status(200).json(likes);
        } catch (e) {
            next(e);
        }
    },

    async createPost(req, res, next) {
        try {
            const { title, content, categories } = req.body;
            const token = req.headers.authorization.split(' ')[1];
            const post = await postService.createPost(title, content, token, categories);
            return res.json(post);
        } catch (e) {
            next(e);
        }
    },

    async LikePost(req, res, next) {
        try {
            const postId = req.params.post_id;
            const token = req.headers.authorization.split(' ')[1];
            const post = postService.addLikeToPost(postId, token);
            res.status(200).json('post liked');
        } catch (e) {
            next(e);
        }
    },

    async UpdatePost(req, res, next) {
        try {
            const postId = req.params.post_id;
            const { title, status, content } = req.body;

            const updatedPost = await postService.updatePost(postId, {
                title,
                status,
                content
            });

            res.status(200).json(updatedPost);
        } catch (e) {
            next(e);
        }
    },

    async DeletePost(req, res, next) {
        try {
            const postId = req.params.post_id;
            await postService.deletePost(postId);
            res.status(200).send('Post deleted successfully');
        } catch (e) {
            next(e);
        }
    },

    async DeleteLike(req, res, next) {
        try {
            const token = req.headers.authorization.split(' ')[1];

            await postService.deleteLike(token);

            res.status(200).send('Like deleted successfully');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = postController;