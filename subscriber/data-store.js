export const createDataStore = (pool) => {

  return {

    saveSubscription: (subscription) => {
      return new Promise((resolve) => {
        pool.query('INSERT INTO subscriptions SET ?',
          { data: JSON.stringify(subscription.data), hub_topic: subscription.hub_topic },
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
    }
  };

};