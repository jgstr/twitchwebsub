const axios = require("axios");
import { clientID } from "../references/authentications";

const getTwitchLiveStreams = () => {
  axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/streams",
    headers: {
      "Client-ID": clientID,
    },
  }).then((streams) => console.log("* Twitch streams: ", streams.data.data));
};

getTwitchLiveStreams();
