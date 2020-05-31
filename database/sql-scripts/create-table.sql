CREATE DATABASE IF NOT EXISTS notifications;
USE notifications;

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(128) NOT NULL,
    hub_topic VARCHAR(500) NOT NULL, 
    lease_start VARCHAR(255),
    PRIMARY KEY (id)
    );

CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(128) NOT NULL,
    subscription_id VARCHAR(128) NOT NULL,
    data VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP(6),
    PRIMARY KEY (id)
    );