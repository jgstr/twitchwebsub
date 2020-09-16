export const createDataStoreFake = (config) => {
  return {
    subscriptionDatabase: new Map(),
    eventDatabase: new Map(),

    getAllSubscriptions: function () {
      return Promise.resolve(this.subscriptionDatabase.values());
    },

    getSubscription: function (subscription) {
      return Promise.resolve(this.subscriptionDatabase.get(subscription));
    },

    saveSubscription: function (subscription) {
      this.subscriptionDatabase.set(subscription.id, subscription);
      return Promise.resolve();
    },

    removeSubscription: function (subscriptionID) {
      return "Removed.";
    },


    // TODO: Next: This needs to match data-store "real".
    saveEvent: function (subID, eventMessage) {
      return Promise.resolve();
    },

    getAllEvents: function (subscriptionID) {
      return Promise.resolve([
        {
          data: {
            "from_name": "ebi",
            "to_name": "oliver",
          }
        }
      ]);
    },

    getLatestEvents: function (subscriptionID) {
      return Promise.resolve([{}, {}]);
    },
  };
};
