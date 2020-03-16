const axios = require('axios');

const getAllSubscriptions = () => { return axios.get('http://localhost:3000/get-subscriptions'); }
const requestSubscription = () => { return axios.get('http://localhost:3000/subscribe'); }
const getAllEvents = () => { return axios.get('http://localhost:3000/get-events'); }
const removeSubscription = () => { return axios.get('http://localhost:3000/unsubscribe'); };

const isRunning = () => {
  return new Promise((resolve) => {
    (function pollStatus(){

      let statusResponse;

      axios.get('http://localhost:3000/status')
      .then((response) => {
        statusResponse = response;
      }).catch((err) => {
        console.log('* Error.', err);
      });

      if(statusResponse.status !== 200) {
        console.log('* Res status: ', statusResponse);
        setTimeout(pollStatus, 2000);
      } else {
        resolve();
      }
    })()

  });
};

module.exports = { getAllSubscriptions, requestSubscription, getAllEvents, removeSubscription, isRunning };