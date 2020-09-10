const axios = require("axios");

export const createSubscriberDriver = (hostUrl) => {
  return {
    getSubscription: (subscriptionID) => {
      return axios.get(`${hostUrl}/get-subscription/${subscriptionID}`);
    },

    getAllSubscriptions: () => {
      return axios.get(`${hostUrl}/get-subscriptions`);
    },

    requestSubscription: (subscription) => {
      return axios({
        method: "POST",
        url: `${hostUrl}/subscribe`,
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
      return axios.get(`${hostUrl}/get-events/${subscriptionID}`);
    },

    getLatestEvents: (subscriptionID) => {
      return axios.get(`${hostUrl}/events/${subscriptionID}`);
    },

    removeSubscription: (subscriptionID) => {
      return axios.get(`${hostUrl}/unsubscribe/${subscriptionID}`);
    },

    checkServerIsRunning: () => {
      return new Promise((resolve) => {
        function pollStatus() {
          axios
            .get(`${hostUrl}/status`)
            .then((response) => {
              if (response.status === 200) {
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
};
