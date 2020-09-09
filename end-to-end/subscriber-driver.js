const axios = require("axios");

export const subscriberDriver = {
  getSubscription: (subscriptionID) => {
    return axios.get(
      `http://localhost:3000/get-subscription/${subscriptionID}`
    );
  },

  getAllSubscriptions: () => {
    return axios.get("http://localhost:3000/get-subscriptions");
  },

  requestSubscription: (subscription) => {
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
  },

  getAllEvents: (subscriptionID) => {
    return axios.get(`http://localhost:3000/get-events/${subscriptionID}`);
  },

  getLatestEvents: (subscriptionID) => {
    return axios.get(`http://localhost:3000/events/${subscriptionID}`);
  },

  removeSubscription: (subscriptionID) => {
    return axios.get(`http://localhost:3000/unsubscribe/${subscriptionID}`);
  },

  checkServerIsRunning: () => {
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
  },
};
