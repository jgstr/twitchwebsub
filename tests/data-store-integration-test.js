import { expect } from "chai";
import { createDataStore } from "../subscriber/adapters/data-store";
import {
  dockerComposeUpDatabase,
  checkDatabaseIsRunning,
  dockerComposeDown,
  createEvents,
  expectOrderOfSavedEventsToMatchRetrievedEvents,
  saveAllEvents,
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
    const subID = uuid();
    const expectedEvent = createEvents(1, subID)[0];

    dataStore
      .saveEvent(
        expectedEvent.subscription_id,
        expectedEvent.id,
        expectedEvent.data
      )
      .then(() => dataStore.getAllEvents(expectedEvent.subscription_id))
      .then((events) => {
        // Note: This loop might be replaceable with .includes somehow.
        // Ie. expect(events).to.deep.include({ id: expectedEvent.id }); But this doesn't work.
        for (let event of events) {
          if (event.id === expectedEvent.id) {
            expect(event).to.include({ id: expectedEvent.id });
            done();
          }
        }
      });
  };
}

function shouldReturnListOfCurrentEvents(dataStore) {
  return function (done) {
    const subscriptionID = uuid();
    const expectedEvents = createEvents(5, subscriptionID);
    saveAllEvents(dataStore, expectedEvents)
      .then(() => dataStore.getLatestEvents(subscriptionID))
      .then((events) => {
        expectOrderOfSavedEventsToMatchRetrievedEvents(
          events,
          expectedEvents,
          done
        );
      });
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

  it(
    "should return a list of current events.",
    shouldReturnListOfCurrentEvents(
      createDataStore(notificationsDatabaseLocalConfig)
    )
  );

  // Note: This does NOT remove all events related to a subscription.
  it(
    "should remove a subscription.",
    shouldRemoveOneSubscription(
      createDataStore(notificationsDatabaseLocalConfig)
    )
  );

  after(function (done) {
    dockerComposeDown(done);
  });
});

describe("Data Store Fake", function () {
  const dataStoreFake = createDataStoreFake("config");

  it(
    "should return a list of subscriptions.",
    shouldReturnAListOfSubs(dataStoreFake)
  );

  it("should return one subscription.", shouldReturnOneSub(dataStoreFake));

  it(
    "should return a list of events.",
    shouldReturnListOfEvents(dataStoreFake)
  );

  it(
    "should return a list of current events.",
    shouldReturnListOfCurrentEvents(dataStoreFake)
  );

  it(
    "should remove a subscription.",
    shouldRemoveOneSubscription(dataStoreFake)
  );
});
