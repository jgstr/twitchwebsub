const axios = require("axios");

const getTwitchLiveStreams = () => {
  axios({
    method: "GET",
    url: "https://api.twitch.tv/helix/streams",
    headers: {
      "Client-ID": "CLIENT-ID-GOES-HERE",
    },
  }).then((streams) => streams.data.data);
};

const getFirstLiveUserID = () => {
  getTwitchLiveStreams[0].user_id;
};

module.exports = { getTwitchLiveStreams, getFirstLiveUserID };
