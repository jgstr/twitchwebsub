import { eventRecordStub, subscriptionRecordStub } from './subscriptions';

let database = [];

const getAllSubscriptions = () => { return [subscriptionRecordStub]; };
const saveSubscription = subscription =>  database.push(subscriptionRecordStub);
const getAllEvents = () => { return [eventRecordStub]; }; 

module.exports = { database, getAllSubscriptions, saveSubscription, getAllEvents };