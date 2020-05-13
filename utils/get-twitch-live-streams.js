const axios = require("axios");
import { appAccessToken, clientID } from "../references/authentications";

// TODO: Eventually, all this might needs its own tests
// and API.
const daysTillTokenExpiry = (milliSeconds) => {
  const secondsInDay = 60 * 60 * 24;
  return Math.floor(milliSeconds / secondsInDay);
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
      console.log(
        "* App Access Token expiry: ",
        daysTillTokenExpiry(response.data.expires_in),
        " days."
      )
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
