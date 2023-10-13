CREATE DATABASE IF NOT EXISTS usof;

CREATE USER IF NOT EXISTS 'kyehorov' @'localhost' IDENTIFIED BY 'securepass';

GRANT ALL PRIVILEGES ON usof.* TO 'kyehorov' @'localhost';

USE usof;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(256) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    fullName VARCHAR(30),
    profilePicture VARCHAR(256) NOT NULL DEFAULT '/avatars/default_avatar.jpg',
    rating INT NOT NULL DEFAULT 0,
    role VARCHAR(30) NOT NULL DEFAULT 'user'
);

