import mysql from "mysql";

const formatSubscription = (subscription) => {
  return {
    id: subscription.subID,
    hub_topic: subscription.hubTopic,
    lease_start: subscription.leaseStart,
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
      return new Promise((resolve) => {
        pool.query(
          "INSERT INTO subscriptions SET ?",
          formatSubscription(subscription),
          (error) => {
            if (error) throw error;
            resolve();
          }
        );
      });
    },

    getSubscription: (subscription) => {
      return new Promise((resolve) => {
        pool.query(
          "SELECT * FROM subscriptions WHERE id=?",
          [subscription.subID],
          (error, results) => {
            if (error) throw error;
            resolve(results[0]);
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

    getAllEvents: (subscriptionId) => {
      return new Promise((resolve) => {
        pool.query(
          "SELECT * FROM events WHERE subscription_id=?",
          [subscriptionId],
          (error, results) => {
            if (error) throw error;
            resolve(results);
          }
        );
      });
    },

    saveEvent: (event) => {
      return new Promise((resolve) => {
        pool.query(
          "INSERT INTO events SET ?",
          {
            id: event.id,
            subscription_id: event.subscription_id,
            data: JSON.stringify(event.data),
          },
          (error) => {
            if (error) throw error;
            resolve();
          }
        );
      });
    },
  };
};
