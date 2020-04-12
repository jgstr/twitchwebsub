import mysql from "mysql";

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
          {
            id: subscription.id,
            hub_topic: subscription.hub_topic,
            lease_start: subscription.lease_start,
          },

          (error) => {
            if (error) throw error;
            resolve();
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
