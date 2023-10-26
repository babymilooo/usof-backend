CREATE DATABASE IF NOT EXISTS usof;

USE usof;

CREATE TABLE IF NOT EXISTS users
(
    id INT NOT NULL AUTO_INCREMENT,
    login varchar(30) NOT NULL,
    password varchar(255) NOT NULL,
    fullName varchar(255) NULL,
    email varchar(64) UNIQUE NOT NULL,
    profilePicture VARCHAR(255) DEFAULT 'https://i.pinimg.com/564x/e3/7a/24/e37a24d7d129c8ca06686f7f3bb27515.jpg',
    rating INT NOT NULL DEFAULT 0,
    role ENUM('admin','user') NOT NULL DEFAULT 'user',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS password_resets (
    email VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS Categories (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS Posts (
    id INT NOT NULL AUTO_INCREMENT,
    author INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    publish_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    content TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES Users(id) ON DELETE CASCADE
);

-- Таблица для связи многие ко многим между Posts и Categories
CREATE TABLE IF NOT EXISTS PostCategories (
    postId INT NOT NULL,
    categoryId INT NOT NULL,
    PRIMARY KEY (postId, categoryId),
    FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE,
    FOREIGN KEY (categoryId) REFERENCES Categories(id)
);

CREATE TABLE IF NOT EXISTS Comments (
    id INT NOT NULL AUTO_INCREMENT,
    author INT NOT NULL,
    publish_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    postId INT NOT NULL, -- связь с постом, к которому оставлен комментарий
    PRIMARY KEY (id),
    FOREIGN KEY (author) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Likes (
    id INT NOT NULL AUTO_INCREMENT,
    author_id INT NOT NULL,
    entity_Id INT NOT NULL, -- ID поста или комментария
    entity_type ENUM('comment', 'post') NOT NULL,
    type ENUM('like', 'dislike') NOT NULL,
    publish_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (author_id) REFERENCES Users(id) ON DELETE CASCADE
);
