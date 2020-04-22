const axios = require("axios");
import { clientID } from "../references/authentications";

const getTwitchLiveStreams = () => {
  axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/streams",
    headers: {
      "Client-ID": clientID,
    },
  }).then((streams) => streams.data.data);
};

const getFirstLiveUserID = () => getTwitchLiveStreams[0].user_id;

module.exports = { getTwitchLiveStreams, getFirstLiveUserID };
