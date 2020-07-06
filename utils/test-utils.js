// TODO: test-utils needs to be divided further:
// Example: all docker stuff under one object, all expections under one object, etc.
const path = require("path");
const compose = require("docker-compose");
import mysql from "mysql";
import { expect } from "chai";
import { uuid } from "uuidv4";

const dockerComposeUp = () => {
  compose.upAll({ cwd: path.join(__dirname, ".."), log: true }).then(
    () => {
      console.log("Docker-compose up ran.");
    },
    (err) => {
      console.log("Error running docker-compose up:", err.message);
    }
  );
};

const dockerComposeDown = (done) => {
  compose.down(["--rmi all"]).then(
    () => {
      console.log("Docker-compose down ran.");
      done();
    },
    (err) => {
      console.log(
        "Something went wrong when trying to stop containers:",
        err.message
      );
      done();
    }
  );
};

const dockerComposeUpDatabase = () => {
  compose
    .upOne("database", { cwd: path.join(__dirname, ".."), log: true })
    .then(
      () => {
        console.log("Docker-compose up ran.");
      },
      (err) => {
        console.log("Error running docker-compose up:", err.message);
      }
    );
};

const pollForSubscription = (getSubscription, subscriptionID) => {
  return new Promise((resolve) => {
    function poll() {
      getSubscription(subscriptionID).then((results) => {
        if (results.data.subscription.id) {
          resolve(results.data.subscription);
        } else {
          setTimeout(poll, 500);
        }
      });
    }
    poll();
  });
};

const checkDatabaseIsRunning = () => {
  return new Promise((resolve) => {
    console.log("* Checking database...");

    let pool = mysql.createPool({
      host: "127.0.0.1",
      port: 3307,
      user: "user",
      password: "password",
      database: "notifications",
    });

    function pingDatabaseForReply() {
      pool.query("SELECT 1", function (error, results) {
        if (error) {
          setTimeout(() => {
            pingDatabaseForReply();
          }, 500);
        } else {
          console.log("* Database up.");
          resolve();
        }
      });
    }

    pingDatabaseForReply();
  });
};

const expectZeroSubscriptions = (results) =>
  expect(results.data.list.length).to.equal(0);

const expectMessageToMatch = (results, message) =>
  expect(results.data.message).to.equal(message);

const expectNo = (results) =>
  expect(results.data.subscription.length).to.equal(0);

const getSubscriptionID = (results) => results.data.subscriptionID;

const expectIDsToMatch = (results, subscriptionID) =>
  expect(results.id).to.equal(subscriptionID);

const expectZeroEvents = (results) =>
  expect(results.data.events.length).to.equal(0);

// TODO: this, expectEventToMatchAtLeastOne and eventsInclude can probably become one helper
const expectEventsToMatch = (results, eventData, callback) => {
  for (const event of results["data"].events) {
    if (event.data === JSON.stringify(eventData)) {
      expect(event.data).to.equal(JSON.stringify(eventData));
      callback();
    }
  }
};

const expectEventToMatchAtLeastOne = (results, eventData, callback) => {
  for (const stubEvent of eventData) {
    for (const event of results["data"].events) {
      if (event.data === JSON.stringify(stubEvent)) {
        expect(event.data).to.equal(JSON.stringify(stubEvent));
        callback();
      }
    }
  }
};

const eventsInclude = (events, eventID, callback) => {
  for (const event of events) {
    if (event.id === eventID) {
      expect(event.id).to.equal(eventID);
      callback();
    }
  }
};

const expectOrderOfSavedEventsToMatchRetrievedEvents = (
  events,
  expectedEvents,
  done
) => {
  let match = true;
  for (let i = 0; i < events.length; ++i) {
    console.log("DB Events: ", events[i]["id"]);
    console.log("Expected Events: ", expectedEvents[events.length - i]["id"]);
    if (events[i]["id"] !== expectedEvents[events.length - i]["id"]) {
      match = false;
    }
  }
  if (match) done();
};

const createEvents = (numberOfEvents, subscriptionID) => {
  const subscription_id = subscriptionID;
  const events = [];
  for (let i = 0; i < numberOfEvents; ++i) {
    events.push({
      id: uuid(),
      subscription_id,
      data: JSON.stringify({ id: `123_${i}`, user_id: `4321_${i}` }),
    });
  }
  return events;
};

function saveAllEvents(dataStore, events) {
  return new Promise((resolve) => {
    (async () => {
      for (let i = 0; i <= events.length; ++i) {
        if (i === events.length) {
          resolve();
          break;
        }
        await dataStore.saveEvent(
          events[i].subscription_id,
          events[i].id,
          events[i].data
        );
      }
    })();
  });
}

const subscriptionRequestByUserStub = {
  clientID: "zqyp13ibm7tejwe0r61ckvz95asblpw",
  hubUrl: "http://host.docker.internal:3001/hub",
  hubCallback: "http://localhost:3000/approval",
  hubTopic: "follows",
  toID: "17337557",
  fromID: null,
  Authorization: "12334567",
};

const eventDataStub = [
  {
    from_id: "1336",
    from_name: "userNameFrom",
    to_id: "1337",
    to_name: "userNameTo",
    followed_at: "2017-08-22T22:55:24Z",
  },
];

const eventsDataStubs = [
  [
    {
      from_id: "1247",
      from_name: "userNameFrom",
      to_id: "1337",
      to_name: "userNameTo",
      followed_at: "2017-08-22T22:55:24Z",
    },
  ],
  [
    {
      from_id: "1248",
      from_name: "userNameFrom",
      to_id: "1337",
      to_name: "userNameTo",
      followed_at: "2017-08-22T22:55:24Z",
    },
  ],
  [
    {
      from_id: "1249",
      from_name: "userNameFrom",
      to_id: "1337",
      to_name: "userNameTo",
      followed_at: "2017-08-22T22:55:24Z",
    },
  ],
];

module.exports = {
  checkDatabaseIsRunning,
  dockerComposeUp,
  dockerComposeDown,
  dockerComposeUpDatabase,
  pollForSubscription,
  expectZeroSubscriptions,
  expectMessageToMatch,
  expectNo,
  getSubscriptionID,
  expectIDsToMatch,
  expectZeroEvents,
  expectEventsToMatch,
  expectEventToMatchAtLeastOne,
  eventsInclude,
  expectOrderOfSavedEventsToMatchRetrievedEvents,
  createEvents,
  saveAllEvents,
  subscriptionRequestByUserStub,
  eventDataStub,
  eventsDataStubs,
};
