const subscriptionRequestByUserStub = {
  clientID: "zqyp13ibm7tejwe0r61ckvz95asblpw",
  hubUrl: "http://host.docker.internal:3001/hub",
  subId: "ac7856cb-5695-4664-b52f-0dc908e3aa7a",
  hubCallback: "http://localhost:3000/approval",
  hubTopic: "https://api.twitch.tv/helix/users/follows?first=1&to_id=17337557", // eventually will be just "follows"
  toID: "17337557",
  fromID: null,
};

module.exports = {
  subscriptionRequestByUserStub,
};
