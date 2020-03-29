const axios = require('axios');

export const createTwitchAdapter = () => {
  return {

    requestSubscription: (subscription) => {
      return axios({
        method: 'POST',
        url: subscription.hubUrl,
        headers: {
          'Content-Type': 'application/json',
          'Client-ID': subscription.clientID
        },
        data:
        {
          'hub.callback': subscription.hubCallback,
          'hub.mode': 'subscribe',
          'hub.topic': subscription.hubTopic,
          'hub.lease_seconds': 600
        }
      });
    }
    
  };
};
