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

    saveEvent: (subID, eventID, eventData) => {
      return dataStore.saveEvent(subID, eventID, eventData);
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

    saveApprovedSubscription: (
      subscriptionsWaitingForTwitchApproval,
      approvedSubscriptionID
    ) => {
      for (const [id, subscription] of subscriptionsWaitingForTwitchApproval) {
        if (id === approvedSubscriptionID) {
          dataStore.saveSubscription(subscription);
        }
        subscriptionsWaitingForTwitchApproval.delete(id);
      }
    },
  };
};
