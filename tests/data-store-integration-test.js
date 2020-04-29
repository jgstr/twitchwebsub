import { expect } from "chai";
import { createDataStore } from "../subscriber/adapters/data-store";
const testUtils = require("../utils/test-utils");
import { notificationsDatabaseLocalConfig } from "../subscriber/authentications";
import { uuid } from "uuidv4";

describe("Data Store", function () {
  this.timeout(13000);

  before(function (done) {
    testUtils.dockerComposeUpDatabase();
    testUtils.checkDatabaseIsRunning().then(() => done());
  });

  it("should return a list of subscriptions.", function (done) {
    let dataStore;

    const expectedValue = {
      id: uuid(),
      topic: "follows",
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);

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
  });

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

  /*

  it("should return a list of events.", function (done) {
    let dataStore;
    const eventUuid = uuid();
    const eventSubscriptionId = uuid();
    const rawEvent = {
      id: eventUuid,
      subscription_id: eventSubscriptionId,
      data: { id: 1234, user_id: 4321 },
    };

    const expectedEvent = {
      id: eventUuid,
      subscription_id: eventSubscriptionId,
      data: JSON.stringify({ id: 1234, user_id: 4321 }),
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveEvent(rawEvent)
      .then(() => {
        return dataStore.getAllEvents(eventSubscriptionId);
      })
      .then((events) => {
        expect(events).to.include.deep.members([expectedEvent]);
        done();
      });
  });
  */

  after(function (done) {
    testUtils.dockerComposeDown(done);
  });
});
