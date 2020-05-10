const createNewSubscription = () => {
  return {
    hubUrl: "",
    subId: "",
    hubCallback: "",
    hubTopic: "",
  };
};

const formatSubscriptionFromRequest = (headers, data) => {
  return {
    clientID: headers["client-id"],
    hubCallback: data["hub.callback"],
    hubTopic: data["hub.topic"],
  };
};

const createSubscriptionFromRequest = (subscriptionID, request) => {
  return {
    id: subscriptionID,
    topic: request.query.topic,
    toID: request.query.to_id ? request.query.to_id : "",
    fromID: request.query.from_id ? request.query.from_id : "",
    userID: request.query.user_id ? request.query.user_id : "",
    clientID: request.headers["client-id"],
  };
};

const saveApprovedSubscriptionFrom = (
  subscriptions,
  approvedID,
  subscriber,
  dataStore
) => {
  for (const sub of subscriptions) {
    if (sub.id === approvedID) {
      subscriber.saveSubscription(dataStore, sub);
    }
    // TODO: then remove subscription from waiting list.
  }
};

module.exports = {
  createNewSubscription,
  formatSubscriptionFromRequest,
  createSubscriptionFromRequest,
  saveApprovedSubscriptionFrom,
};
