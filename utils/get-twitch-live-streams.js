const axios = require("axios");
import { clientID, clientSecret } from "../references/authentications";

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
      Authorization: `Bearer ${clientSecret}`,
    },
  })
    .then((streams) => {
      console.log("* Days until token expiry: about ", daysTillTokenExpiry());
      console.log("* Twitch streams: ", streams.data.data);
    })
    .catch((err) => {
      console.log(
        "* Check that your token is valid.\n* Days until expiry: about ",
        daysTillTokenExpiry()
      );
      console.error(
        "* get-twitch-live-streams error: ",
        err.response.data.message
      );
    });
};

getTwitchLiveStreams();
