const sequelize = require('../db/db');
const userModel = require('../models/user-model')(sequelize);
const categoryModel = require('../models/category-model')(sequelize);
const commentModel = require('../models/comment-model')(sequelize);
const likeModel = require('../models/like-model')(sequelize);
const postModel = require('../models/post-model')(sequelize);
const postCategoryModel = require('../models/postCategory-model')(sequelize);
const ApiError = require('../exceptions/api-error');
const { post } = require('../router/post-router');

postModel.belongsToMany(categoryModel, { through: postCategoryModel, foreignKey: 'postId' });
categoryModel.belongsToMany(postModel, { through: postCategoryModel, foreignKey: 'categoryId' });

class PostService {
    async createPost(title, content, token, categories) {
        if (!token) {
            throw ApiError.BadRequest("No token provided");
        }
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        authorId = decoded.id;
        if (!authorId) {
            throw ApiError.BadRequest("author id is required");
        }

        const post = await postModel.create({ title, content, authorId });

        if (categories && categories.length > 0) {
            for (let categoryId of categories) {
                const category = await categoryModel.findByPk(categoryId);

                if (!category) {
                    throw ApiError.BadRequest(`Category with id ${categoryId} not found`);
                }

                // Если категория существует, создайте новую запись в таблице PostCategories
                await postCategoryModel.create({ postId: post.id, categoryId });
            }
        }

        return post;
    }

    async getAllPosts(token) {
        const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        if (!token) {
            throw ApiError.BadRequest("No token provided");
        }
        const userRole = decodedToken.role;
        const userId = decodedToken.id;

        let posts;
        if (userRole === 'admin') {
            // Если пользователь - админ, получаем все посты без ограничений
            posts = await postModel.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'login', 'fullName'],
                    },
                    {
                        model: Category,
                        through: { attributes: [] },
                        attributes: ['id', 'title'],
                    }
                ]
            });
        } else {
            // Если пользователь не админ, получаем только активные посты и свои неактивные посты
            posts = await postModel.findAll({
                where: {
                    [Op.or]: [
                        { status: 'active' },
                        {
                            status: 'inactive',
                            author: userId  // неактивные посты, но автором которых является данный пользователь
                        }
                    ]
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'login', 'fullName'],
                    },
                    {
                        model: Category,
                        through: { attributes: [] },
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
                    attributes: ['id', 'login', 'fullName'],
                },
                {
                    model: categoryModel,
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
            include: [  // Дополнительно получаем информацию об авторе каждого комментария
                {
                    model: User,
                    attributes: ['id', 'login', 'email']  // Выберите те атрибуты, которые вы хотите отобразить
                }
            ],
            order: [['publish_date', 'DESC']]  // Опционально: сортировка комментариев по дате публикации
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

        authorId = decoded.id;

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
        userId = decoded.id;
        if (!userId) {
            throw ApiError.BadRequest("author id is required");
        }

        await likeModel.create({
            author_id: userId,
            entity_Id: postId,
            entity_type: 'post',
            type: 'like'
        });

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

    async deleteLike(likeId, token) {

        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        userId = decoded.id;
        if (!userId) {
            throw ApiError.BadRequest("author id is required");
        }

        const like = await likeModel.findOne({
            where: {
                id: likeId,
                author_id: userId
            }
        });

        if (!like) {
            throw ApiError.BadRequest('Like not found');
        }

        await like.destroy();
    }
}

module.exports = new PostService();