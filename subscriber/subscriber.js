const axios = require('axios');

const getAllSubscriptions = (dataStore) => { return dataStore.getAllSubscriptions(); };

const requestSubscription = (hubUrl, clientID, hubCallback, hubTopic) => {
  return axios({
    method: 'POST',
    url: hubUrl,
    headers: {
      'Content-Type': 'application/json',
      'Client-ID': clientID
    },
    data:
    {
      'hub.callback': hubCallback,
      'hub.mode': 'subscribe',
      'hub.topic': hubTopic,
      'hub.lease_seconds': 600
    }
  })
};

const saveSubscription = (dataStore, subscription) => { return dataStore.saveSubscription(subscription); };

module.exports = { getAllSubscriptions, requestSubscription, saveSubscription };