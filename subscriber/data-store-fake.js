import { subscription } from '../utils/test-utils';

let database = [];

const getAllSubscriptions = () => { return [subscription]; };
const saveSubscription = subscription =>  database.push(subscription); 

module.exports = { getAllSubscriptions, saveSubscription, database };