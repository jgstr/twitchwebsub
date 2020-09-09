const axios = require("axios");

export const getSubscription = (subscriptionID) => {
  return axios.get(`http://localhost:3000/get-subscription/${subscriptionID}`);
};

export const getAllSubscriptions = () => {
  return axios.get("http://localhost:3000/get-subscriptions");
};

export const requestSubscription = (subscription) => {
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
      Authorization: `Bearer ${subscription.Authorization}`,
    },
  });
};

export const getAllEvents = (subscriptionID) => {
  return axios.get(`http://localhost:3000/get-events/${subscriptionID}`);
};

export const getLatestEvents = (subscriptionID) => {
  return axios.get(`http://localhost:3000/events/${subscriptionID}`);
};

export const removeSubscription = (subscriptionID) => {
  return axios.get(`http://localhost:3000/unsubscribe/${subscriptionID}`);
};

export const checkServerIsRunning = () => {
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
