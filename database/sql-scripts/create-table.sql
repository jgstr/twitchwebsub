CREATE TABLE IF NOT EXISTS notifications (
    id INT NOT NULL AUTO_INCREMENT,
    event_data BLOB NOT NULL,
    PRIMARY KEY (id)
    );