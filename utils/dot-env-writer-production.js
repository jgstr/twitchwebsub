const fileSystem = require("fs");
const axios = require("axios");

axios
  .get("http://localhost:4040/api/tunnels")
  .then((res) => {
    const callback =
      "hub_callback_env=" + res.data.tunnels[0]["public_url"] + "/approval";

    const hub = "hub_url_env=https://api.twitch.tv/helix/webhooks/hub";

    fileSystem.writeFile(".env", `${callback}\n${hub}`, function (err) {
      if (err) return console.error(err);
    });
  })
  .catch((err) => console.log("Did you start ngrok?"));
