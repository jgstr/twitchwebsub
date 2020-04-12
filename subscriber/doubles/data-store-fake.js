import { eventRecordStub, subscriptionRecordStub } from "./subscriptions";

let database = [];

const getAllSubscriptions = () => [subscriptionRecordStub];

const getSubscription = (subscription) => subscription;

const saveSubscription = (subscription) =>
  database.push(subscriptionRecordStub);

const getAllEvents = () => [eventRecordStub];

module.exports = {
  database,
  getAllSubscriptions,
  getSubscription,
  saveSubscription,
  getAllEvents,
};
