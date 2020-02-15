const axios = require('axios');

const getAllSubscriptions = () => { return axios.get('http://localhost:3000/get-subscriptions'); }

const requestSubscription = () => { return axios.get('http://localhost:3000/subscribe'); }

module.exports = { getAllSubscriptions, requestSubscription };