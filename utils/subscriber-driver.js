const axios = require('axios');
import mysql from 'mysql';

const getAllSubscriptions = () => { return axios.get('http://localhost:3000/get-subscriptions'); }
const requestSubscription = () => { return axios.get('http://localhost:3000/subscribe'); }
const getAllEvents = () => { return axios.get('http://localhost:3000/get-events'); }
const removeSubscription = () => { return axios.get('http://localhost:3000/unsubscribe'); };
const isRunning = () => { return axios.get('http://localhost:3000/status'); };

module.exports = { getAllSubscriptions, requestSubscription, getAllEvents, removeSubscription, isRunning };