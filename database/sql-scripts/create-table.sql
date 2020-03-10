CREATE DATABASE IF NOT EXISTS notifications;
USE notifications;

CREATE TABLE IF NOT EXISTS subscriptions (
    id INT NOT NULL AUTO_INCREMENT,
    hub_topic VARCHAR(500) NOT NULL, 
    lease_start TIMESTAMP,
    PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS events (
    id INT NOT NULL AUTO_INCREMENT,
    data VARCHAR(1000) NOT NULL,
    PRIMARY KEY (id)
    );