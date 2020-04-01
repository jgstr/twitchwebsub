const subscriptionHardCoded = {
  hubUrl: 'https://twitch.com/helix',
  subId: '12345',
  hubCallback: 'https://localhost:3000/12345-approval-callback',
  hubTopic: 'https://twitch.com/topic'
};

const createNewSubscription = () => {
  return {
    hubUrl: '',
    subId: '',
    hubCallback: '',
    hubTopic: ''
  };
};

module.exports = { subscriptionHardCoded, createNewSubscription };