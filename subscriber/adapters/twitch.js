const axios = require('axios');

export const createTwitchAdapter = () => {

  
  return {
    
    requestSubscription: (subscription) => {
      return new Promise((resolve, reject) => {
        
        const isLocalDevelopment = subscription.hubUrl.includes('localhost');

        axios({
          method: 'POST',
          url: (isLocalDevelopment ? subscription.hubUrl : 'https://api.twitch.tv/helix/webhooks/hub'),
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
        })
        .then(() => resolve('Received.'))
        .catch(() => reject('Not received.'));

      });
    }

  };
};
