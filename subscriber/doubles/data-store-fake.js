import { eventRecordStub, subscriptionRecordStub } from "./subscriptions";

let subscriptionDatabase = [];
let eventDatabase = [];

const getAllSubscriptions = () => [subscriptionRecordStub];

const getSubscription = (subscription) => subscription;

const saveSubscription = (subscription) =>
  subscriptionDatabase.push(subscriptionRecordStub);

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
