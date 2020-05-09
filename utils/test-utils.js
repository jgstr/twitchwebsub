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

const expectRequestConfirmation = (results) =>
  expect(results.data.message).to.equal("Received.");

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

module.exports = {
  checkDatabaseIsRunning,
  dockerComposeUp,
  dockerComposeDown,
  dockerComposeUpDatabase,
  pollForSubscription,
  expectZeroSubscriptions,
  expectRequestConfirmation,
  getSubscriptionID,
  expectIDsToMatch,
  expectZeroEvents,
  expectEventsToMatch,
};
