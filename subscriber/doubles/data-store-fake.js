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


    // TODO: this does a lot. Maybe break into smaller functions.
    saveEvent: function (subID, eventMessage, eventID) {
      // TODO: implement this after N responds to question on dicord 9/14/20.
      // Format message to exactly what I need. Also, add "id" with eventID to properties.
      // const eventMessageFormatted = JSON.stringify(eventMessage);

      // Place holder for above.
      const eventMessageFormatted = eventMessage;

      if (this.eventDatabase.has(subID)) {
        this.eventDatabase.set(
          subID,
          [{ eventID, eventMessageFormatted }].concat(this.eventDatabase.get(subID))
        );
      }
      else {
        this.eventDatabase.set(
          subID,
          new Array().concat([{ eventID, eventMessageFormatted }])
        );
      }
      return Promise.resolve();
    },

    // This should just return even event and format to JSON.
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
