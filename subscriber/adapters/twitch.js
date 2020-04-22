const axios = require("axios");

const createHubTopicURL = (topicType, toID, fromID, userID) => {
  return "https://api.twitch.tv/helix/users/follows?first=1&to_id=17337557";
};

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
            // "hub.topic": subscription.topic,
            "hub.topic": createHubTopicURL(
              subscription.topic,
              subscription.toID,
              subscription.fromID,
              subscription.userID
            ),
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
