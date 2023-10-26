const sequelize = require('../db/db');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model')(sequelize);
const categoryModel = require('../models/category-model')(sequelize);
const commentModel = require('../models/comment-model')(sequelize);
const likeModel = require('../models/like-model')(sequelize);
const postModel = require('../models/post-model')(sequelize);
const postCategoryModel = require('../models/postCategory-model')(sequelize);
const ApiError = require('../exceptions/api-error');

userModel.hasMany(postModel, { foreignKey: 'author', as: 'postAuthorData', onDelete: 'CASCADE'});
postModel.belongsTo(userModel, { foreignKey: 'author', as: 'postAuthorData' });

userModel.hasMany(commentModel, { foreignKey: 'author', as: 'commentAuthorData', onDelete: 'CASCADE'});
commentModel.belongsTo(userModel, { foreignKey: 'author', as: 'commentAuthorData' });

userModel.hasMany(likeModel, { foreignKey: 'author_id', as: 'likeAuthorData', onDelete: 'CASCADE'});
likeModel.belongsTo(userModel, { foreignKey: 'author_id', as: 'likeAuthorData' });

postModel.hasMany(commentModel, { foreignKey: 'postId', as: 'commentPostData', onDelete: 'CASCADE' });
commentModel.belongsTo(postModel, { foreignKey: 'postId', as: 'commentPostData' });

postModel.belongsToMany(categoryModel, { through: 'PostCategory', foreignKey: 'postId', otherKey: 'categoryId', as: 'postsCategories' });
categoryModel.belongsToMany(postModel, { through: 'PostCategory', foreignKey: 'categoryId', otherKey: 'postId', as: 'postsCategories' });

postModel.hasMany(likeModel, { foreignKey: 'entity_Id', constraints: false, scope: { entity_type: 'post' }, as: 'postLikes', onDelete: 'CASCADE' });

commentModel.hasMany(likeModel, { foreignKey: 'entity_Id', constraints: false, scope: { entity_type: 'comment' }, as: 'commentLikes', onDelete: 'CASCADE' });

class PostService {
    async createPost(title, content, token, categories) {
        if (!token) {
            throw ApiError.BadRequest("No token provided");
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const authorId = decoded.id;
        if (!authorId) {
            throw ApiError.BadRequest("author id is required");
        }

        const post = await postModel.create({ title, content, author: authorId });

        if (categories && categories.length > 0) {
            for (let categoryName of categories) {
                const category = await categoryModel.findOne({ where: { title: categoryName } });  // используем название для поиска категории

                if (!category) {
                    throw ApiError.BadRequest(`Category with name ${categoryName} not found`);
                }

                // Если категория существует, создайте новую запись в таблице PostCategories
                await postCategoryModel.create({ postId: post.id, categoryId: category.id });  // используем ID найденной категории для создания записи
            }
        }

        return post;
    }

    async getAllPosts(token) {
        if (!token) {
            throw ApiError.BadRequest("No token provided");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userRole = decodedToken.role;
        const userId = decodedToken.id;

        let posts;
        if (userRole === 'admin') {
            posts = await postModel.findAll({
                include: [
                    {
                        model: userModel,
                        as: 'postAuthorData',
                        attributes: ['id', 'login', 'fullName'],
                    },
                    {
                        model: categoryModel,
                        as: 'postsCategories',
                        through: { attributes: [] },
                        attributes: ['id', 'title'],
                    }
                ]
            });
        } else {
            posts = await postModel.findAll({
                where: {
                    [Op.or]: [
                        { status: 'active' },
                        {
                            status: 'inactive',
                            author: userId
                        }
                    ]
                },
                include: [
                    {
                        model: userModel,
                        as: 'postAuthorData',
                        attributes: ['id', 'login', 'fullName'],
                    },
                    {
                        model: categoryModel,
                        through: { attributes: [] },
                        as: 'postsCategories',
                        attributes: ['id', 'title'],
                    }
                ]
            });
        }

        return posts;
    }

    async getPost(postId) {
        const post = await postModel.findByPk(postId, {
            include: [
                {
                    model: userModel,
                    as: 'postAuthorData',
                    attributes: ['id', 'login', 'fullName'],
                },
                {
                    model: categoryModel,
                    as: 'postsCategories',
                    through: { attributes: [] },
                    attributes: ['id', 'title'],
                }
            ]
        });

        if (!post) {
            throw ApiError.BadRequest("Post not found");
        }

        return post;
    }

    async getAllCommentsForPost(postId) {
        if (!postId) {
            throw ApiError.BadRequest('Post ID is required');
        }

        const comments = await commentModel.findAll({
            where: { postId: postId },
            include: [
                {
                    model: userModel,
                    as: 'commentAuthorData',
                    attributes: ['id', 'login', 'email']
                }
            ],
            order: [['publish_date', 'DESC']]
        });

        return comments;
    }

    async CreateComment(postId, token, content) {
        if (!postId) {
            throw ApiError.BadRequest('Post ID is required');
        }

        if (!token) {
            throw ApiError.BadRequest("No token provided");
        }

        if (!content) {
            throw ApiError.BadRequest("content is required");
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        const authorId = decoded.id;

        if (!authorId) {
            throw ApiError.BadRequest("author id is required");
        }

        const comment = await commentModel.create({
            author: authorId,
            content: content,
            postId: postId
        });

        return comment;
    }

    async getAllCategoriesForPost(postId) {
        const post = await postModel.findByPk(postId, {
            include: {
                model: categoryModel,
                as: 'categories',
                through: { attributes: [] }
            }
        });

        if (!post) {
            throw ApiError.BadRequest('Post not found');
        }

        return post.categories;
    }

    async getAllLikesForPost(postId) {
        return await likeModel.findAll({
            where: {
                entity_Id: postId,
                entity_type: 'post'
            }
        });
    }

    async addLikeToPost(postId, token) {
        const post = await postModel.findByPk(postId);
        if (!post) {
            throw ApiError.BadRequest('Post not found');
        }

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userId = decoded.id;
        if (!userId) {
            throw ApiError.BadRequest("author id is required");
        }

        const like = await likeModel.findOne({ where: { author_id: userId } });
        if (like) {
            throw ApiError.BadRequest('the post has already been liked');
        }
        else {
            await likeModel.create({
                author_id: userId,
                entity_Id: postId,
                entity_type: 'post',
                type: 'like'
            });
        }

        return post;
    }

    async updatePost(postId, data) {
        const post = await postModel.findByPk(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        await post.update(data);
        return post;
    }

    async deletePost(postId) {
        const post = await postModel.findByPk(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        await post.destroy();
    }

    async deleteLike(token) {

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        const userId = decoded.id;
        if (!userId) {
            throw ApiError.BadRequest("author id is required");
        }

        const like = await likeModel.findOne({ where: { author_id: userId } });

        if (!like) {
            throw ApiError.BadRequest('Like not found');
        }

        await like.destroy();
    }
}

module.exports = new PostService();