import { eventRecordStub, subscriptionRecordStub } from "./subscriptions";

let subscriptionDatabase = new Map();
let eventDatabase = [];

const getAllSubscriptions = () => [subscriptionRecordStub];

const getSubscription = (subscription) => subscription;

const saveSubscription = (subscription) =>
  subscriptionDatabase.set(subscription.id, subscription);

const saveEvent = (subID, eventID, eventData) => {
  const event = {
    subID,
    eventID,
    eventData,
  };
  eventDatabase.push(event);
};

const getAllEvents = () => [eventRecordStub];

module.exports = {
  eventDatabase,
  subscriptionDatabase,
  getAllSubscriptions,
  getSubscription,
  saveSubscription,
  saveEvent,
  getAllEvents,
};
