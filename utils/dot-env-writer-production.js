const fileSystem = require('fs');

const callback = 'ngrok here';
const hub = 'hub_url_env=https://api.twitch.tv/helix/webhooks/hub';

fileSystem.writeFile('.env', `${callback}\n${hub}`, function(err){
  if (err) return console.error(err);
});
