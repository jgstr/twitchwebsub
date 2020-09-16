const path = require("path");
const compose = require("docker-compose");
import mysql from "mysql";
import { expect } from "chai";

export const dockerComposeUp = () => {
  compose.upAll({ cwd: path.join(__dirname, ".."), log: true }).then(
    () => {
      console.log("Docker-compose up ran.");
    },
    (err) => {
      console.log("Error running docker-compose up:", err.message);
    }
  );
};

export const dockerComposeDown = (done) => {
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

export const dockerComposeUpDatabase = () => {
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

export const pollForSubscription = (getSubscription, subscriptionID) => {
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

export const checkDatabaseIsRunning = () => {
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

export const expectZeroSubscriptions = (results) =>
  expect(results.data.list.length).to.equal(0);

export const expectMessageToMatch = (results, message) =>
  expect(results.data.message).to.equal(message);

export const expectNo = (results) =>
  expect(results.data.subscription.length).to.equal(0);

export const getSubscriptionID = (results) => results.data.subscriptionID;

export const expectIDsToMatch = (results, subscriptionID) =>
  expect(results.id).to.equal(subscriptionID);

export const expectZeroEvents = (results) =>
  expect(results.data.events.length).to.equal(0);

export const expectEventsToMatch = (results, eventData, callback) => {
  for (const event of results["data"].events) {
    if (event.data === JSON.stringify(eventData)) {
      expect(event.data).to.equal(JSON.stringify(eventData));
      callback();
    }
  }
};

export const expectEventToMatchAtLeastOne = (results, eventData, callback) => {
  for (const stubEvent of eventData) {
    for (const event of results["data"].events) {
      if (event.data === JSON.stringify(stubEvent)) {
        expect(event.data).to.equal(JSON.stringify(stubEvent));
        callback();
      }
    }
  }
};

export const subscriptionRequestByUserStub = {
  hubUrl: "http://host.docker.internal:3001/hub",
  hubCallback: "http://localhost:3000/approval",
  hubTopic: "follows",
  toID: "17337557",
  fromID: null,
};

export const eventDataStub = [
  {
    from_id: "1336",
    from_name: "userNameFrom",
    to_id: "1337",
    to_name: "userNameTo",
    followed_at: "2017-08-22T22:55:24Z",
  },
];

export const eventsDataStubs = [
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
