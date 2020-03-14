const axios = require('axios');
import { start } from '../subscriber/subscriber-server';

const getAllSubscriptions = () => { return axios.get('http://localhost:3000/get-subscriptions'); }
const requestSubscription = () => { return axios.get('http://localhost:3000/subscribe'); }
const getAllEvents = () => { return axios.get('http://localhost:3000/get-events'); }
const removeSubscription = () => { return axios.get('http://localhost:3000/unsubscribe'); };
const startServer = () => { return start };
const stopServer = (app, done) => { app.close(done); }

module.exports = { getAllSubscriptions, requestSubscription, getAllEvents, removeSubscription, startServer, stopServer };