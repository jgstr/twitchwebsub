export const createDataStore = (pool) => {

  return {

    checkStatus: () => {
      return new Promise((resolve, reject) => {
        pool.query('SELECT 1', (error) => {
          if(error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    },

    saveSubscription: (subscription) => {
      return new Promise((resolve) => {
        pool.query('INSERT INTO subscriptions SET ?',
          {
            hub_topic: subscription.hub_topic,
            lease_start: subscription.lease_start
          },

          (error) => {
            if (error) throw error;
            resolve();
          });

      })
    },

    getAllSubscriptions: () => {
      return new Promise((resolve) => {
        pool.query('SELECT * FROM subscriptions', (error, results) => {
          if (error) throw error;
          resolve(results);
        });
      });
    },

    getAllEvents: () => {
      return new Promise((resolve) => {
        pool.query('SELECT * FROM events', (error, results) => {
          if (error) throw error;
          resolve(results);
        });
      });
    },

    saveEvent: (event) => {
      return new Promise((resolve) => {
        pool.query('INSERT INTO events SET ?', { data: JSON.stringify(event.data) }, (error) => {
          if (error) throw error;
          resolve();
        });
      });
    }
  };
};