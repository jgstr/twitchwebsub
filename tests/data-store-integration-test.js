import { assert, expect } from "chai";
import { createDataStore } from "../subscriber/adapters/data-store";
import {
  dockerComposeUpDatabase,
  checkDatabaseIsRunning,
  dockerComposeDown,
} from "../utils/test-utils";
import { notificationsDatabaseLocalConfig } from "../subscriber/authentications";
import { uuid } from "uuidv4";
import { createDataStoreFake } from "../subscriber/doubles/data-store-fake";

function shouldReturnAListOfSubs(dataStore) {
  return function (done) {
    const expectedValue = {
      id: uuid(),
      topic: "follows",
    };

    dataStore
      .saveSubscription(expectedValue)
      .then(() => {
        return dataStore.getAllSubscriptions();
      })
      .then((subscriptions) => {
        for (const sub of subscriptions) {
          if (sub.id === expectedValue.id) {
            expect(sub.id).to.equal(expectedValue.id);
            done();
          }
        }
      });
  };
}

function shouldReturnOneSub(dataStore) {
  return function (done) {
    const expectedValue = {
      id: uuid(),
      topic: "follows",
    };

    dataStore
      .saveSubscription(expectedValue)
      .then(() => dataStore.getSubscription(expectedValue.id))
      .then((subscription) => {
        expect(subscription.id).to.equal(expectedValue.id);
        done();
      });
  };
}

function shouldReturnListOfEvents(dataStore) {
  return function (done) {

    const subscriptionID = uuid();
    const expectedEvent = [
      {
        "from_name": "ebi",
        "to_name": "oliver",
      }
    ];

    dataStore.saveEvent(
      subscriptionID,
      expectedEvent
    )
      .then(() => dataStore.getAllEvents(subscriptionID))
      .then(events => {
        console.log("\n\n\n\n********** Events: ", events);
        expect(events[0].data).to.deep.equal(expectedEvent[0]);
        done();
      });
  };
}

function shouldReturnListOfCurrentEvents(dataStore) {
  return function () {

    assert.fail();

    const subscriptionID = uuid();
    const expectedEvents = [{}, {}, {}, {}, {}];

    dataStore.saveEvent(subscriptionID, expectedEvents)
      .then(() => dataStore.getLatestEvents(subscriptionID))
      .then(events => { });
  };
}

function shouldRemoveOneSubscription(dataStore) {
  return function (done) {
    const expectedValue = {
      id: uuid(),
      topic: "follows",
    };

    dataStore
      .saveSubscription(expectedValue)
      .then(() => dataStore.getSubscription(expectedValue.id))
      .then((subscription) =>
        expect(subscription.id).to.equal(expectedValue.id)
      )
      .then(() => dataStore.removeSubscription(expectedValue.id))
      .then((results) => {
        expect(results).to.equal("Removed.");
        done();
      });
  };
}

describe("Data Store MySQL", function () {
  this.timeout(30000);

  before(function (done) {
    dockerComposeUpDatabase();
    checkDatabaseIsRunning().then(() => done());
  });

  it(
    "should return a list of subscriptions.",
    shouldReturnAListOfSubs(createDataStore(notificationsDatabaseLocalConfig))
  );

  it(
    "should return one subscription.",
    shouldReturnOneSub(createDataStore(notificationsDatabaseLocalConfig))
  );

  it(
    "should return a list of events.",
    shouldReturnListOfEvents(createDataStore(notificationsDatabaseLocalConfig))
  );

  // Note: I force this test to fail. Events get saved too quickly. MySQL does not offer a TIMESTAMP accurate enough for ordering on millisceond.
  // So I might have to create the TIMESTAMP myself if I want to use this feature.
  it(
    "should return a list of current events.",
    shouldReturnListOfCurrentEvents(createDataStore(notificationsDatabaseLocalConfig))
  );

  // Note: This does NOT remove all events related to a subscription.
  it("should remove a subscription.",
    shouldRemoveOneSubscription(createDataStore(notificationsDatabaseLocalConfig))
  );

  after(function (done) {
    dockerComposeDown(done);
  });
});

describe("Data Store Fake", function () {
  const dataStoreFake = createDataStoreFake("config");

  it("should return a list of subscriptions.", shouldReturnAListOfSubs(dataStoreFake));

  it("should return one subscription.", shouldReturnOneSub(dataStoreFake));

  it("should return a list of events.", shouldReturnListOfEvents(dataStoreFake));

  it("should return a list of current events.", shouldReturnListOfCurrentEvents(dataStoreFake));

  it("should remove a subscription.", shouldRemoveOneSubscription(dataStoreFake));
});
