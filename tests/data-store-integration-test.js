import { assert, expect } from "chai";
const chai = require("chai");
const deepEqualInAnyOrder = require('deep-equal-in-any-order');
chai.use(deepEqualInAnyOrder);
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

// TODO: For testing a REPLACE change to data-store function.
// copy this, add a start_lease, save once, change the lease, save again, then expect the "changed" subscription.
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

function shouldSaveAListOfEvents(dataStore) {
  return function (done) {

    const subscriptionID = uuid();
    const eventsFromTwitch = [
      {
        "from_name": "ebi",
        "to_name": "oliver",
      },
      {
        "from_name": "johnjacob",
        "to_name": "jingleheimerschmidt",
      }
    ];

    dataStore.saveEvents(
      subscriptionID,
      eventsFromTwitch
    )
      .then(() => dataStore.getAllEvents(subscriptionID))
      .then(eventsFromDatabase => {
        expect(eventsFromDatabase.map(event => event.data)).to.have.deep.members(eventsFromTwitch);
        done();
      });
  };
}

function shouldReturnListOfCurrentEvents(dataStore) {
  return function () {

    const subscriptionID = uuid();
    const expectedEvents = [{}, {}, {}, {}, {}];

    dataStore.saveEvents(subscriptionID, expectedEvents)
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
    shouldSaveAListOfEvents(createDataStore(notificationsDatabaseLocalConfig))
  );

  
  // Note: This does NOT remove all events related to a subscription.
  it("should remove a subscription.",
  shouldRemoveOneSubscription(createDataStore(notificationsDatabaseLocalConfig))
  );
    
  // Note: I ignore test to fail. Events get saved too quickly. MySQL does not offer a TIMESTAMP accurate enough for ordering on millisceond.
  // So I might have to create the TIMESTAMP myself if I want to use this feature.
  it.skip(
    "should return a list of current events.",
    shouldReturnListOfCurrentEvents(createDataStore(notificationsDatabaseLocalConfig))
  );

  after(function (done) {
    dockerComposeDown(done);
  });
});

describe("Data Store Fake", function () {
  const dataStoreFake = createDataStoreFake("config");

  it("should return a list of subscriptions.", shouldReturnAListOfSubs(dataStoreFake));

  it("should return one subscription.", shouldReturnOneSub(dataStoreFake));

  it("should save a list of events.", shouldSaveAListOfEvents(dataStoreFake));

  it("should remove a subscription.", shouldRemoveOneSubscription(dataStoreFake));

  it("should renew a subscription.", shouldRenewOneSubscriptions(createDataStore(dataStoreFake)));

  it.skip("should return a list of current events.", shouldReturnListOfCurrentEvents(dataStoreFake));

});
