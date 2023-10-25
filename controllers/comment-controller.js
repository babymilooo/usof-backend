const commentService = require('../service/comment-service');

const commentController = {
    async getCommentData(req, res, next) {
        try {
            const commentId = req.params.comment_id;
            const comment = await commentService.getCommentData(commentId);
            res.status(200).json(comment);
        } catch (e) {
            next(e);
        }
    },

    async getCommentLikes(req, res, next) {
        try {
            const commentId = req.params.comment_id;
            const likes = await commentService.getCommentLikes(commentId);
            res.status(200).json(likes);
        } catch (e) {
            next(e);
        }
    },

    async createLikeForComment(req, res, next) {
        try {
            const commentId = req.params.comment_id;
            const token = req.headers.authorization.split(' ')[1];
            await commentService.createLikeForComment(commentId, token);
            res.status(201).send("Like added successfully.");
        } catch (e) {
            next(e);
        }
    },

    async updateComment(req, res, next) {
        try {
            const commentId = req.params.comment_id;
            await commentService.updateComment(commentId, req.body);
            res.status(200).send("Comment updated successfully.");
        } catch (e) {
            next(e);
        }
    },

    async deleteComment(req, res, next) {
        try {
            const commentId = req.params.comment_id;
            await commentService.deleteComment(commentId);
            res.status(200).send("Comment deleted successfully.");
        } catch (e) {
            next(e);
        }
    },

    async deleteLikeForComment(req, res, next) {
        try {
            const commentId = req.params.comment_id;
            const token = req.headers.authorization.split(' ')[1];
            await commentService.deleteLikeForComment(commentId, token);
            res.status(200).send("Like removed successfully.");
        } catch (e) {
            next(e);
        }
    }
}

module.exports = commentController;