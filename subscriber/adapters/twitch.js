const axios = require("axios");

export const createTwitchAdapter = () => {
  return {
    requestSubscription: (subscription) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: subscription.hubUrl,
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
        })
          .then(() => resolve("Received."))
          .catch((error) => {
            console.error("* Response message: ", error.response.data.message);
            reject("Not received.");
          });
      });
    },
  };
};
