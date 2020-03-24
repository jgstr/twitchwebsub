// const axios = require('axios');

/* Remove after integrating unit-tested subscriber methods into e2e test.

const requestSubscription = (request, response, hubUrl, clientID, hubCallback, hubTopic) => {

  axios({
    method: 'POST',
    url: hubUrl,
    headers: {
      'Content-Type': 'application/json',
      'Client-ID': clientID
    },
    data:
    {
      'hub.callback': hubCallback,
      'hub.mode': 'subscribe',
      'hub.topic': hubTopic,
      'hub.lease_seconds': 600
    }
  })
    .then(twitchResponse => { console.log('* Twitch Hub Approval response: ', twitchResponse.status); })
    .catch(error => console.log(error));

};
*/

// module.exports = { requestSubscription };
module.exports = {  };