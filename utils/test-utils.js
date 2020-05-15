const path = require("path");
const compose = require("docker-compose");
import mysql from "mysql";
import { expect } from "chai";

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

const expectEventsToMatch = (results, eventData, callback) => {
  for (const event of results.data.events) {
    if (event.data === JSON.stringify(eventData)) {
      expect(event.data).to.equal(JSON.stringify(eventData));
      callback();
    }
  }
};

const subscriptionRequestByUserStub = {
  clientID: "zqyp13ibm7tejwe0r61ckvz95asblpw",
  hubUrl: "http://host.docker.internal:3001/hub",
  hubCallback: "http://localhost:3000/approval",
  hubTopic: "follows",
  toID: "17337557",
  fromID: null,
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
  subscriptionRequestByUserStub,
  eventDataStub,
};
