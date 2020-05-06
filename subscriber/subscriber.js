const getAllSubscriptions = (dataStore) => {
  return dataStore.getAllSubscriptions();
};

const getSubscription = (dataStore, subscriptionID) => {
  return dataStore.getSubscription(subscriptionID);
};

const requestSubscription = (twitch, subscription) => {
  return twitch.requestSubscription(subscription);
};

const saveSubscription = (dataStore, subscription) => {
  return dataStore.saveSubscription(subscription);
};

const saveEvent = (dataStore, subID, eventID, eventData) => {
  return dataStore.saveEvent(subID, eventID, eventData);
};

const getAllEvents = (dataStore) => {
  return dataStore.getAllEvents();
};

module.exports = {
  getAllSubscriptions,
  getSubscription,
  requestSubscription,
  saveSubscription,
  saveEvent,
  getAllEvents,
};
