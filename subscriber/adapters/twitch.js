const axios = require("axios");

const createHubTopicURL = (topicType, toID, fromID, userID) => {
  if (topicType === "follows") {
    if (toID !== "" && toID !== null && fromID !== "" && fromID !== null) {
      return `https://api.twitch.tv/helix/users/follows?first=1&from_id=${fromID}&to_id=${toID}`;
    }
    if (toID !== "" && toID !== null) {
      return `https://api.twitch.tv/helix/users/follows?first=1&to_id=${toID}`;
    }
    if (fromID !== "" && fromID !== null) {
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
      const hubTopicURL = createHubTopicURL(
        subscription.topic,
        subscription.toID,
        subscription.fromID,
        subscription.userID
      );

      return new Promise((resolve, reject) => {
        axios({
          method: "POST",
          url: twitchHub,
          headers: {
            "content-type": "application/json",
            "client-id": subscription.clientID,
          },
          data: {
            "hub.callback": hubCallback + `-${subscription.id}`,
            "hub.mode": "subscribe",
            "hub.topic": hubTopicURL,
            "hub.lease_seconds": 600,
          },
        })
          .then((res) => {
            resolve("Received.");
          })
          .catch((err) => {
            console.log("* Error from Twitch: ", err.response.data);
            reject("Not received.");
          });
      });
    },
  };
};
