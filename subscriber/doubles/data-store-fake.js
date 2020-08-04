import {
  eventRecordStub,
  eventRecordListStub,
  subscriptionRecordStub,
} from "./subscriptions";

let subscriptionDatabase = new Map();
let eventDatabase = [];

const getAllSubscriptions = () =>
  Promise.resolve(subscriptionDatabase.values());

const getSubscription = (subscription) => subscription;

const saveSubscription = (subscription) => {
  subscriptionDatabase.set(subscription.id, subscription);
  return Promise.resolve();
};

const removeSubscription = (subscriptionID) => {
  return "Removed.";
};
const saveEvent = (subID, eventID, eventData) => {
  const event = {
    subID,
    eventID,
    eventData,
  };
  eventDatabase.push(event);
};

const getAllEvents = (subscriptionID) => [eventRecordStub];

const getLatestEvents = (subscriptionID) => eventRecordListStub;

module.exports = {
  eventDatabase,
  subscriptionDatabase,
  getAllSubscriptions,
  getSubscription,
  saveSubscription,
  removeSubscription,
  saveEvent,
  getAllEvents,
  getLatestEvents,
};
