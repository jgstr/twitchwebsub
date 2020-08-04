import { expect } from "chai";
import { createDataStore } from "../subscriber/adapters/data-store";
import {
  dockerComposeUpDatabase,
  checkDatabaseIsRunning,
  dockerComposeDown,
  createEvents,
  eventsInclude,
  expectOrderOfSavedEventsToMatchRetrievedEvents,
  saveAllEvents,
} from "../utils/test-utils";
import { notificationsDatabaseLocalConfig } from "../subscriber/authentications";
import { uuid } from "uuidv4";
import {
  getAllSubscriptions,
  saveSubscription,
} from "../subscriber/doubles/data-store-fake";

describe("Data Store", function () {
  this.timeout(30000);

  before(function (done) {
    dockerComposeUpDatabase();
    checkDatabaseIsRunning().then(() => done());
  });

  // Contract tests:
  // Only way you use a test is if you confirm fake works likes real thing.

  //   const datastore1 = createDataStore1()
  //   const datastore2 = createDataStore2()

  //   function createShouldReturnSubs(datastore) {
  //     retrun function(done) {
  //       ///...
  //     }
  //   }

  //   it("", createShouldReturnSubs(datastore1))
  //   it("", createShouldReturnSubs(datastore2))

  // it("", someFuncThatReturnsItCallback(datastore));

  function shouldReturnAListOfSub(dataStore) {
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
  // TODO: put in different describes, one for MySQL one for in-memory/fake.
  it(
    "should return a list of subscriptions.",
    shouldReturnAListOfSub(createDataStore(notificationsDatabaseLocalConfig))
  );

  // TODO: must refactor data fake to pass dataStoreFake.
  // Make note in anki. This is test feedback in the wild.
  it(
    "should return a list of subscriptions.",
    shouldReturnAListOfSub({ getAllSubscriptions, saveSubscription })
  );

  it("should return one subscription.", function (done) {
    let dataStore;

    const expectedValue = {
      id: uuid(),
      topic: "follows",
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveSubscription(expectedValue)
      .then(() => dataStore.getSubscription(expectedValue.id))
      .then((subscription) => {
        expect(subscription.id).to.equal(expectedValue.id);
        done();
      });
  });

  it("should return a list of events.", function (done) {
    let dataStore;
    const subID = uuid();
    const expectedEvent = createEvents(1, subID)[0];
    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveEvent(
        expectedEvent.subscription_id,
        expectedEvent.id,
        expectedEvent.data
      )
      .then(() => dataStore.getAllEvents(expectedEvent.subscription_id))
      .then((events) => {
        eventsInclude(events, expectedEvent.id, done); // replace with chai.expect.include
        expect(events);
      });
  });

  it("should return a list of current events.", function (done) {
    let dataStore = createDataStore(notificationsDatabaseLocalConfig);
    const subscriptionID = uuid();
    const expectedEvents = createEvents(6, subscriptionID);
    saveAllEvents(dataStore, expectedEvents)
      .then(() => dataStore.getLatestEvents(subscriptionID))
      .then((events) => {
        expectOrderOfSavedEventsToMatchRetrievedEvents(
          events,
          expectedEvents,
          done
        );
      });
  });

  // Note: This does NOT remove all events related to a subscription.
  it("should remove a subscription.", function (done) {
    let dataStore;

    const expectedValue = {
      id: uuid(),
      topic: "follows",
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
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
  });

  after(function (done) {
    dockerComposeDown(done);
  });
});
