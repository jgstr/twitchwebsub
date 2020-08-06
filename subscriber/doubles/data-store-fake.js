import { eventRecordStub, eventRecordListStub } from "./subscriptions";

export const createDataStoreFake = (config) => {
  return {
    subscriptionDatabase: new Map(),
    eventDatabase: [],
    eventDatabaseMap: new Map(),

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
      this.eventDatabaseMap.set(subID, [eventID, eventData]);
      return Promise.resolve();
    },

    getAllEvents: function (subscriptionID) {
      const events = Array.from(
        this.eventDatabaseMap,
        ([subscription_id, data]) => ({
          id: data[0],
          subscription_id,
          data: data[1],
          created_at: "",
        })
      );
      return Promise.resolve(events);
    },

    getLatestEvents: function (subscriptionID) {
      eventRecordListStub;
    },
  };
};

// saveEvent: function (subID, eventID, eventData) {
//   const event = {
//     subID,
//     eventID,
//     eventData,
//   };
//   this.eventDatabase.push(event);
// },
