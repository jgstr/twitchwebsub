import { uuid } from "uuidv4";

export const createSubscriberManager = (dataStore, twitch) => {
  return {
    status: () => dataStore.checkStatus(),

    getAllSubscriptions: () => {
      return dataStore.getAllSubscriptions();
    },

    getSubscription: (subscriptionID) => {
      return dataStore.getSubscription(subscriptionID);
    },

    requestSubscription: (subscription) => {
      return twitch.requestSubscription(subscription);
    },

    saveSubscription: (subscription) => {
      return dataStore.saveSubscription(subscription);
    },

    saveEvent: (subID, eventData) => {
      // TODO: Instead of loop, try this recommendation:
      // https://stackoverflow.com/questions/8899802/how-do-i-do-a-bulk-insert-in-mysql-using-node-js
      eventData.forEach(event => dataStore.saveEvent(subID, eventData, uuid()));
      return Promise.resolve();
    },

    getAllEvents: (subscriptionID) => {
      return dataStore.getAllEvents(subscriptionID);
    },

    getLatestEvents: (subscriptionID) => {
      return dataStore.getLatestEvents(subscriptionID);
    },

    removeSubscription: (subscriptionID) => {
      return dataStore.removeSubscription(subscriptionID);
    },

    // TODO: 1) if twitch is down, this will overflow and crash
    //       2) if your server crashes, the in-memory list is gone
    //          One way, add STATUS column to subs table.
    saveApprovedSubscription:
      (subscriptionsWaitingForTwitchApproval, approvedSubscriptionID) => {
        for (const [id, subscription] of subscriptionsWaitingForTwitchApproval) {
          if (id === approvedSubscriptionID) {
            dataStore.saveSubscription(subscription);
          }
          subscriptionsWaitingForTwitchApproval.delete(id);
        }
      },
  };
};
