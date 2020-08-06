import { eventRecordStub, eventRecordListStub } from "./subscriptions";

export const createDataStoreFake = (config) => {
  return {
    subscriptionDatabase: new Map(),
    eventDatabase: [],

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
