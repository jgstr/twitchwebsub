const axios = require("axios");
import { clientID, oAuthBearerToken } from "../subscriber/authentications";

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
          "Client-ID": clientID,
          Authorization: `Bearer ${oAuthBearerToken}`,
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
      return new Promise((resolve, reject) => {
        let connectionAttempts = 0;
        function pollStatus() {
          if (connectionAttempts === 8) {
            console.error(
              `Could not connect to the database after ${connectionAttempts} attempts.`
            );
            reject();
          }

          connectionAttempts++;

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
