const axios = require("axios");
import { appAccessToken, clientID } from "../references/authentications";

const daysTillTokenExpiry = () => {
  const millisInDay = 1000 * 60 * 60 * 24;
  const tokenExpiry = new Date(2020, 6, 3); // July 7, 2020
  const millisTillExpiry = tokenExpiry - Date.now();
  return Math.floor(millisTillExpiry / millisInDay);
};

const validateAccessToken = () => {
  axios({
    method: "GET",
    url: "https://id.twitch.tv/oauth2/validate",
    headers: {
      Authorization: `OAuth ${appAccessToken}`,
    },
  })
    .then((response) =>
      console.log("* App Access Token expiry: ", response.data.expires_in)
    )
    .catch((err) => console.error("* Twitch error: ", err));
};

const getTwitchLiveStreams = () => {
  axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/streams",
    headers: {
      "Client-ID": clientID,
      Authorization: `Bearer ${appAccessToken}`,
    },
  })
    .then((streams) => {
      streams.data.data.forEach((stream) =>
        console.log("User ID: ", stream.user_id, " Name: ", stream.user_name)
      );
    })
    .catch((err) =>
      console.error("* Twitch error: ", err.response.data.message)
    );
};
validateAccessToken();
getTwitchLiveStreams();
