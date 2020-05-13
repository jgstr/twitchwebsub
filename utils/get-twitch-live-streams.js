const axios = require("axios");
import {
  appAccessToken,
  clientID,
  clientSecret,
} from "../references/authentications";

const daysTillTokenExpiry = () => {
  const millisInDay = 1000 * 60 * 60 * 24;
  const tokenExpiry = new Date(2020, 6, 7); // July 7, 2020
  const millisTillExpiry = tokenExpiry - Date.now();
  return Math.floor(millisTillExpiry / millisInDay);
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
      console.log(
        "* Days until App Access Token expiry: about ",
        daysTillTokenExpiry()
      );
      console.log("* Twitch streams: ", streams.data.data);
    })
    .catch((err) => {
      console.log(
        "* Check that your OAuth is valid.\n* Days until App Access Token expiry: about ",
        daysTillTokenExpiry()
      );
      console.error(
        "* get-twitch-live-streams error: ",
        err.response.data.message
      );
    });
};

getTwitchLiveStreams();
