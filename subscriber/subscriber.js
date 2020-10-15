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

      renewSubscription: (subscriptionID) => {
        if(!subscriptionID)
          return "You did not provide a subscriber ID.";
        return "Your subscription was renewed.";
      }
  };
};
