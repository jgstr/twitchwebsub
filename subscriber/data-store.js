export const createDataStore = (pool) => {

  return {
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