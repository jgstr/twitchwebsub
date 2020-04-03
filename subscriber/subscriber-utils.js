const createNewSubscription = () => {
  return {
    hubUrl: '',
    subId: '',
    hubCallback: '',
    hubTopic: ''
  };
};

const formatSubscriptionFromRequest = (headers, data) => {
  return {
    clientID: headers['client-id'],
    hubCallback: data['hub.callback'],
    hubTopic: data['hub.topic']
  };
};

module.exports = { createNewSubscription, formatSubscriptionFromRequest };