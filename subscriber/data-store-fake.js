import { subscription, event } from '../utils/test-utils';

let database = [];

const getAllSubscriptions = () => { return [subscription]; };
const saveSubscription = subscription =>  database.push(subscription);
const getAllEvents = () => { return [event]; }; 

module.exports = { database, getAllSubscriptions, saveSubscription, getAllEvents };