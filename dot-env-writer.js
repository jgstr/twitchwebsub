const fileSystem = require('fs');

  fileSystem.writeFile('.env', 'hub_callback_env=http://localhost:3000/approval\nhub_url_env=http://host.docker.internal:3001/hub', function(err){
    if (err) return console.error(err);
  });
