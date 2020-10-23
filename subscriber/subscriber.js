import { DateTime, Duration } from "luxon";


export const createSubscriberManager = (dataStore, twitch) => {

  const subscriptionsWaitingForTwitchApproval = new Map();

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

    saveEvents: (subID, eventData) => {
      return dataStore.saveEvents(subID, eventData);
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

    addToSubscriptionsAwaitingApproval: (subId, subscription) => {
      subscriptionsWaitingForTwitchApproval.set(subId, subscription);
    },


    // TODO: 1) if twitch is down, this will overflow and crash
    //       2) if your server crashes, the in-memory list is gone
    //          One way, add STATUS column to subs table.
    saveApprovedSubscription:
      (approvedSubscriptionID) => {
        for (const [id, subscription] of subscriptionsWaitingForTwitchApproval) {
          if (id === approvedSubscriptionID) {
            dataStore.saveSubscription(subscription);
          }
          subscriptionsWaitingForTwitchApproval.delete(id);
        }
    },

    getSubscriptionsAwaitingTwitchApproval: () =>  subscriptionsWaitingForTwitchApproval,

    renewExpiringSubscriptions: () => {
      dataStore.getAllSubscriptions();
    }
  };
};
