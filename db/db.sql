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
