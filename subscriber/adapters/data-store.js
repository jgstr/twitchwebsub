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

      return new Promise((resolve) => {
        pool.query(
          "INSERT INTO subscriptions SET ?",
          formattedSubscription,
          (error) => {
            if (error) throw error;
            resolve();
          }
        );
      });
    },

    getSubscription: (subscriptionID) => {
      return new Promise((resolve) => {
        pool.query(
          "SELECT * FROM subscriptions WHERE id=?",
          subscriptionID,
          (error, results) => {
            if (error) throw error;
            if (results.length === 0) resolve(results);
            else resolve(formatDatabaseResult(results[0]));
          }
        );
      });
    },

    getAllSubscriptions: () => {
      return new Promise((resolve) => {
        pool.query("SELECT * FROM subscriptions", (error, results) => {
          if (error) throw error;
          resolve(results);
        });
      });
    },

    getAllEvents: (subscriptionID) => {
      return new Promise((resolve) => {
        pool.query(
          "SELECT * FROM events WHERE subscription_id=?",
          [subscriptionID],
          (error, results) => {
            if (error) throw error;
            resolve(results);
          }
        );
      });
    },

    getLatestEvents: (subscriptionID) => {
      return new Promise((resolve) => {
        resolve(["event", "event", "event", "event", "event"]);
      });
    },

    saveEvent: (subscriptionID, eventID, eventData) => {
      return new Promise((resolve) => {
        pool.query(
          "INSERT INTO events SET ?",
          {
            id: eventID,
            subscription_id: subscriptionID,
            data: JSON.stringify(eventData),
          },
          (error) => {
            if (error) throw error;
            resolve();
          }
        );
      });
    },

    removeSubscription: (subscriptionID) => {
      return new Promise((resolve) => {
        pool.query(
          "DELETE FROM subscriptions WHERE id=?",
          subscriptionID,
          (error) => {
            if (error) throw error;
            resolve("Removed.");
          }
        );
      });
    },
  };
};
