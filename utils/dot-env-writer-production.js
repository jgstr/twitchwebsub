const fileSystem = require('fs');
const ngrok = require('./get-ngrok-url');

const callback = ngrok.getPublicUrl(); //TODO: Gets undefined. Figure out this next.
const hub = 'hub_url_env=https://api.twitch.tv/helix/webhooks/hub';

fileSystem.writeFile('.env', `${callback}\n${hub}`, function(err){
  if (err) return console.error(err);
});
