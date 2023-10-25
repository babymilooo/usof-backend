const sequelize = require('../db/db');
const commentModel = require('../models/comment-model')(sequelize);
const likeModel = require('../models/like-model')(sequelize);

class commentService {
    async getCommentData(commentId) {
        return await commentModel.findByPk(commentId);
    }

    async getCommentLikes(commentId) {
        return await likeModel.findAll({
            where: {
                entity_Id: commentId,
                entity_type: 'comment'
            }
        });
    }

    async createLikeForComment(commentId, token) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        userId = decoded.id;
        if (!userId) {
            throw ApiError.BadRequest("author id is required");
        }

        return await likeModel.create({
            author_id: userId,
            entity_Id: commentId,
            entity_type: 'comment',
            type: 'like'
        });
    }

    async updateComment(commentId, data) {
        return await commentModel.update(data, {
            where: { id: commentId }
        });
    }

    async deleteComment(commentId) {
        return await commentModel.destroy({
            where: { id: commentId }
        });
    }

    async deleteLikeForComment(commentId, userId) {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        userId = decoded.id;
        if (!userId) {
            throw ApiError.BadRequest("author id is required");
        }
        return await likeModel.destroy({
            where: {
                entity_Id: commentId,
                entity_type: 'comment',
                author_id: userId
            }
        });
    }
}

module.exports = new commentService();