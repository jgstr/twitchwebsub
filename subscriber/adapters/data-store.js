import mysql from "mysql";
const timestampFormatter = require("moment");

const formatSubscription = (subscription) => {
  return {
    id: subscription.id,
    hub_topic: subscription.topic,
    lease_start: timestampFormatter
      .utc(new Date())
      .format("YYYY-MM-DD HH:mm:ss"),
  };
};

const formatDatabaseResult = (result) => {
  return {
    id: result.id,
    topic: result.hub_topic,
    leaseStart: result.lease_start,
  };
};

export const createDataStore = (config) => {
  let pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  return {
    checkStatus: () => {
      return new Promise((resolve, reject) => {
        pool.query("SELECT 1", (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    },

    saveSubscription: (subscription) => {
      const formattedSubscription = formatSubscription(subscription);

      return new Promise((resolve, reject) => {
        pool.query(
          "INSERT INTO subscriptions SET ?",
          formattedSubscription,
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });
    },

    getSubscription: (subscriptionID) => {
      return new Promise((resolve, reject) => {
        pool.query(
          "SELECT * FROM subscriptions WHERE id=?",
          subscriptionID,
          (error, results) => {
            if (error) {
              reject(error);
            }
            if (results.length === 0) {
              resolve(results);
            } else {
              resolve(formatDatabaseResult(results[0]));
            }
          }
        );
      });
    },

    getAllSubscriptions: () => {
      return new Promise((resolve, reject) => {
        pool.query("SELECT * FROM subscriptions", (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    },

    getAllEvents: (subscriptionID) => {
      return new Promise((resolve, reject) => {
        pool.query(
          "SELECT * FROM events WHERE subscription_id=?",
          [subscriptionID],
          (error, results) => {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
    },

    getLatestEvents: (subscriptionID) => {
      const query =
        "SELECT * FROM events WHERE subscription_id=? ORDER BY created_at DESC LIMIT 5";

      return new Promise((resolve, reject) => {
        pool.query(query, [subscriptionID], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    },

    // Note: Server should create TIMESTAMP instead of MySQL, but parsing a TIMESTAMP between Node to MySQL is tricky.
    saveEvent: (subscriptionID, eventID, eventData) => {
      return new Promise((resolve, reject) => {
        pool.query(
          "INSERT INTO events SET ?",
          {
            id: eventID,
            subscription_id: subscriptionID,
            data: JSON.stringify(eventData),
          },
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          }
        );
      });
    },

    removeSubscription: (subscriptionID) => {
      return new Promise((resolve, reject) => {
        pool.query(
          "DELETE FROM subscriptions WHERE id=?",
          subscriptionID,
          (error) => {
            if (error) {
              reject(error);
            } else {
              resolve("Removed.");
            }
          }
        );
      });
    },
  };
};
