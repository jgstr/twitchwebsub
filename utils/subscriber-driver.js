const axios = require("axios");

const getLiveStreams = () => {};

const getSubscription = (subscriptionID) => {
  return axios.get(`http://localhost:3000/get-subscription-${subscriptionID}`);
};

const getAllSubscriptions = () => {
  return axios.get("http://localhost:3000/get-subscriptions");
};

const requestSubscription = (subscription) => {
  return axios({
    method: "POST",
    url: "http://localhost:3000/subscribe",
    params: {
      topic: subscription.hubTopic,
      to_id: subscription.toID,
      from_id: subscription.fromID,
    },
    headers: {
      "Content-Type": "application/json",
      "Client-ID": subscription.clientID,
    },
  });
};

const getAllEvents = (subscriptionID) => {
  return axios.get(`http://localhost:3000/get-events-${subscriptionID}`);
};

const removeSubscription = () => {
  return axios.get("http://localhost:3000/unsubscribe");
};

const checkServerIsRunning = () => {
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
  getLiveStreams,
  getSubscription,
  getAllSubscriptions,
  requestSubscription,
  getAllEvents,
  removeSubscription,
  checkServerIsRunning,
};
