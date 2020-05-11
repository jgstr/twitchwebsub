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

const saveApprovedSubscription = (
  subscriber,
  dataStore,
  subscriptionsWaitingForTwitchApproval,
  approvedSubscriptionID
) => {
  for (const [id, subscription] of subscriptionsWaitingForTwitchApproval) {
    if (id === approvedSubscriptionID) {
      subscriber.saveSubscription(dataStore, subscription);
    }
    subscriptionsWaitingForTwitchApproval.delete(id);
  }
};

module.exports = {
  createNewSubscription,
  formatSubscriptionFromRequest,
  createSubscriptionFromRequest,
  saveApprovedSubscription,
};
