const axios = require("axios");

const getSubscription = (subscription) => {
  return axios.get(
    `http://localhost:3000/get-subscription-${subscription.subId}`
  );
};

const getAllSubscriptions = () => {
  return axios.get("http://localhost:3000/get-subscriptions");
};

const requestSubscription = (subscription) => {
  return axios({
    method: "POST",
    url: "http://localhost:3000/subscribe",
    headers: {
      "Content-Type": "application/json",
      "Client-ID": subscription.clientID,
    },
    data: {
      "hub.callback": subscription.hubCallback,
      "hub.mode": "subscribe",
      "hub.topic": subscription.hubTopic,
      "hub.lease_seconds": 600,
    },
  });
};

const getAllEvents = () => {
  return axios.get("http://localhost:3000/get-events");
};
const removeSubscription = () => {
  return axios.get("http://localhost:3000/unsubscribe");
};

const isRunning = () => {
  return new Promise((resolve) => {
    function pollStatus() {
      axios
        .get("http://localhost:3000/status")
        .then((response) => {
          if (response.status === 200) {
            console.log("* Database up.");
            resolve();
          } else {
            setTimeout(pollStatus, 3000);
          }
        })
        .catch((err) => {
          setTimeout(pollStatus, 3000);
        });
    }

    console.log("* Checking database... ");
    pollStatus();
  });
};

module.exports = {
  getSubscription,
  getAllSubscriptions,
  requestSubscription,
  getAllEvents,
  removeSubscription,
  isRunning,
};
