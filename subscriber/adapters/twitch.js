const axios = require("axios");

export const createTwitchAdapter = (twitchHub) => {
  return {
    requestSubscription: (subscription) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: twitchHub,
          headers: {
            "Content-Type": "application/json",
            "Client-ID": subscription.clientID,
          },
          data: {
            "hub.callback": subscription.hubCallback,
            "hub.mode": "subscribe",
            "hub.topic": subscription.topic,
            "hub.lease_seconds": 600,
          },
        })
          .then(() => resolve("Received."))
          .catch((error) => {
            console.error(error);
            reject("Not received.");
          });
      });
    },
  };
};
