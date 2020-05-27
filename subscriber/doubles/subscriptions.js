const subscriptionDummy = {
  clientID: "",
  hubUrl: "",
  subID: "",
  hubCallback: "",
  hubTopic: "",
};

const subscriptionRecordStub = {
  id: "ac7856cb-5695-4664-b52f-0dc908e3aa7a",
  hub_topic: "https://twitch.com",
  lease_start: "2020-03-21 01:01:01",
};

const subscriptionRequestStub = {
  "hub.callback": "http://localhost:3000/approval-callback",
  "hub.mode": "subscribe",
  "hub.topic": "https://twitch.com/topic",
  "hub.lease_seconds": 600,
};

const subscriptionStub = {
  clientID: "zqyp13ibm7tejwe0r61ckvz95asblpw",
  hubUrl: "http://host.docker.internal:3001/hub",
  subID: "ac7856cb-5695-4664-b52f-0dc908e3aa7a",
  hubCallback: "http://localhost:3000/approval",
  topic: "follows",
  toID: "17337557",
  fromID: null,
  leaseStart: "2020-03-21 01:01:01",
  authorization: 12345,
};

const subscriptionFromUserInputStub = {
  clientID: "zqyp13ibm7tejwe0r61ckvz95asblpw",
  hubUrl: "http://host.docker.internal:3001/hub",
  subID: "",
  hubCallback: "",
  hubTopic: "https://api.twitch.tv/helix/users/follows?first=1&to_id=17337557",
};

const eventRecordStub = {
  id: "0dc956cb-4664-5695-b52f-ac7808e7aa3a",
  subscription_id: "ac7856cb-5695-4664-b52f-0dc908e3aa7a",
  data: {},
};

const eventRecordListStub = [
  {
    id: "0dc956cb-4664-5695-b52f-ac7808e7aa3a",
    subscription_id: "ac7856cb-5695-4664-b52f-0dc908e3aa7a",
    data: {},
  },
  {
    id: "984956cb-4664-5695-b52f-ac7808e7abc2",
    subscription_id: "ac7856cb-5695-4664-b52f-0dc908e3aa7a",
    data: {},
  },
  {
    id: "ae09956cb-4664-5695-b52f-ac7808e7af5d",
    subscription_id: "ac7856cb-5695-4664-b52f-0dc908e3aa7a",
    data: {},
  },
];

module.exports = {
  eventRecordStub,
  eventRecordListStub,
  subscriptionDummy,
  subscriptionFromUserInputStub,
  subscriptionRecordStub,
  subscriptionRequestStub,
  subscriptionStub,
};
