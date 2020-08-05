import { eventRecordStub, eventRecordListStub } from "./subscriptions";

export const createDataStore = (config) => {
  return {
    subscriptionDatabase: new Map(),
    eventDatabase: [],

    getAllSubscriptions: function () {
      Promise.resolve(this.subscriptionDatabase.values());
    },

    getSubscription: function (subscription) {
      subscription;
    },

    saveSubscription: function (subscription) {
      this.subscriptionDatabase.set(subscription.id, subscription);
      return Promise.resolve();
    },

    removeSubscription: function (subscriptionID) {
      return "Removed.";
    },

    saveEvent: function (subID, eventID, eventData) {
      const event = {
        subID,
        eventID,
        eventData,
      };
      this.eventDatabase.push(event);
    },

    getAllEvents: function (subscriptionID) {
      [eventRecordStub];
    },

    getLatestEvents: function (subscriptionID) {
      eventRecordListStub;
    },
  };
};
