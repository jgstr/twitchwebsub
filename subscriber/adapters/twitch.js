const axios = require("axios");

const createHubTopicURL = (topicType, toID, fromID, userID) => {
  if (topicType === "follows") {
    if (toID !== "" && fromID !== "") {
      return `https://api.twitch.tv/helix/users/follows?first=1&from_id=${fromID}&to_id=${toID}`;
    }
    if (toID !== "") {
      return `https://api.twitch.tv/helix/users/follows?first=1&to_id=${toID}`;
    }
    if (fromID !== "") {
      return `https://api.twitch.tv/helix/users/follows?first=1&from_id=${fromID}`;
    }
  }

  if (topicType === "streams") {
    return `https://api.twitch.tv/helix/streams?user_id=${userID}`;
  }

  // TODO: needs error handling.
};

export const createTwitchAdapter = (twitchHub, hubCallback) => {
  return {
    requestSubscription: (subscription) => {
      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: twitchHub,
          headers: {
            "content-type": "application/json",
            "client-id": subscription.clientID,
          },
          data: {
            "hub.callback": hubCallback + `-${subscription.subID}`,
            "hub.mode": "subscribe",
            "hub.topic": createHubTopicURL(
              subscription.hubTopic,
              subscription.toID,
              subscription.fromID,
              subscription.userID
            ),
            "hub.lease_seconds": 600,
          },
        })
          .then(() => resolve("Received."))
          .catch(() => {
            reject("Not received.");
          });
      });
    },
  };
};
