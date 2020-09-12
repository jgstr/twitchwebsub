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

    saveEvent: function (subID, eventData, eventID) {
      if (this.eventDatabase.has(subID)) {
        this.eventDatabase.set(
          subID,
          [{ eventID, eventData }].concat(this.eventDatabase.get(subID))
        );
      } else {
        this.eventDatabase.set(
          subID,
          new Array().concat([{ eventID, eventData }])
        );
      }
      return Promise.resolve();
    },

    getAllEvents: function (subscriptionID) {
      const events = Array.from(
        this.eventDatabase.get(subscriptionID),
        (event) => ({
          id: event.eventID,
          subscription_id: subscriptionID,
          data: event.eventData,
          created_at: "",
        })
      );
      return Promise.resolve(events);
    },

    getLatestEvents: function (subscriptionID) {
      const events = Array.from(
        this.eventDatabase.get(subscriptionID),
        (event) => ({
          id: event.eventID,
          subscription_id: subscriptionID,
          data: event.eventData,
          created_at: "",
        })
      );
      return Promise.resolve(events);
    },
  };
};
