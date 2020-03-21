const axios = require('axios');

const getAllSubscriptions = () => { return axios.get('http://localhost:3000/get-subscriptions'); }
const requestSubscription = () => { return axios.get('http://localhost:3000/subscribe'); }
const getAllEvents = () => { return axios.get('http://localhost:3000/get-events'); }
const removeSubscription = () => { return axios.get('http://localhost:3000/unsubscribe'); };

const isRunning = () => {

  return new Promise((resolve) => {
    function pollStatus() {

      axios.get('http://localhost:3000/status')
        .then((response) => {
          if (response.status === 200) {
            console.log('* Database up.');
            resolve();
          } else {
            setTimeout(pollStatus, 3000);
          }
        }).catch((err) => {
          setTimeout(pollStatus, 3000);
        });
    }

    console.log('* Checking database... ');
    pollStatus();

  });
};

module.exports = { getAllSubscriptions, requestSubscription, getAllEvents, removeSubscription, isRunning };