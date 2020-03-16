const axios = require('axios');

const getAllSubscriptions = () => { return axios.get('http://localhost:3000/get-subscriptions'); }
const requestSubscription = () => { return axios.get('http://localhost:3000/subscribe'); }
const getAllEvents = () => { return axios.get('http://localhost:3000/get-events'); }
const removeSubscription = () => { return axios.get('http://localhost:3000/unsubscribe'); };

const isRunning = () => {

  return new Promise((resolve) => {
    function pollStatus() {

      let statusResponse;

      axios.get('http://localhost:3000/status')
        .then((response) => {
          if (response.status === 200) {
            resolve();
          } else {
            setTimeout(pollStatus, 3000);
          }
        }).catch((err) => {
          console.log('* Error.');
          setTimeout(pollStatus, 3000);
        });
    }

    pollStatus()

  });
};

module.exports = { getAllSubscriptions, requestSubscription, getAllEvents, removeSubscription, isRunning };