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


    saveEvents: function (subscriptionID, eventMessagesList) {
      const eventsFormattedForDatabase = eventMessagesList.map(event => ({ data: event }));
      this.eventDatabase.set(subscriptionID, eventsFormattedForDatabase);
      return Promise.resolve();
    },

    getAllEvents: function (subscriptionID) {
      return Promise.resolve(this.eventDatabase.get(subscriptionID));
    },

    getLatestEvents: function (subscriptionID) {
      return Promise.resolve([{}, {}]);
    },
  };
};
