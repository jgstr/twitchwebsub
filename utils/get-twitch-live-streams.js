const axios = require("axios");
import { clientID, clientSecret } from "../references/authentications";

const getTwitchLiveStreams = () => {
  axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/streams",
    headers: {
      "Client-ID": clientID,
      Authorization: `Bearer ${clientSecret}`,
    },
  })
    .then((streams) => console.log("* Twitch streams: ", streams.data.data))
    .catch((err) => console.error("* get-twitch-live-streams error: ", err));
};

getTwitchLiveStreams();
