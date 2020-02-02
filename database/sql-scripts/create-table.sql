CREATE DATABASE IF NOT EXISTS notifications;
USE notifications;
CREATE TABLE IF NOT EXISTS subscriptions (
    id INT NOT NULL AUTO_INCREMENT,
    data VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
    );