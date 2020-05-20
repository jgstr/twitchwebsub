const status = (dataStore) => dataStore.checkStatus();

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

const getAllEvents = (dataStore, subscriptionID) => {
  return dataStore.getAllEvents(subscriptionID);
};

const removeSubscription = (dataStore, subscriptionID) => {
  return dataStore.removeSubscription(subscriptionID);
};

// export default subscriber = {};
// TODO: use export keyword (but also use import). Or put them all in an object.
module.exports = {
  status,
  getAllSubscriptions,
  getSubscription,
  requestSubscription,
  saveSubscription,
  saveEvent,
  getAllEvents,
  removeSubscription,
};
