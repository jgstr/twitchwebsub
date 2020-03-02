const axios = require('axios');

const getAllSubscriptions = () => { return axios.get('http://localhost:3000/get-subscriptions'); }
const requestSubscription = () => { return axios.get('http://localhost:3000/subscribe'); }
const getAllEvents = () => { return axios.get('http://localhost:3000/get-events'); }

module.exports = { getAllSubscriptions, requestSubscription, getAllEvents };