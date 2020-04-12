const fileSystem = require("fs");

const callback = "hub_callback_env=http://localhost:3000/approval";
const hub = "hub_url_env=http://host.docker.internal:3001/hub";

fileSystem.writeFile(".env", `${callback}\n${hub}`, function (err) {
  if (err) return console.error(err);
});
