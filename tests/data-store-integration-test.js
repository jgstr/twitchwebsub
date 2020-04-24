import { expect } from "chai";
import { createDataStore } from "../subscriber/adapters/data-store";
const testUtils = require("../utils/test-utils");
import { notificationsDatabaseLocalConfig } from "../subscriber/authentications";
const timestampFormatter = require("moment");
import { uuid } from "uuidv4";
import { subscriptionStub } from "../subscriber/doubles/subscriptions";

describe("Data Store", function () {
  this.timeout(13000);

  before(function (done) {
    testUtils.dockerComposeUpDatabase();
    testUtils.checkDatabaseIsRunning().then(() => done());
  });

  it("should return a list of subscriptions.", function (done) {
    let dataStore;

    const expectedValue = {
      subID: uuid(),
      hubTopic: "follows",
      leaseStart: timestampFormatter
        .utc(new Date())
        .format("YYYY-MM-DD HH:mm:ss"),
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);

    dataStore
      .saveSubscription(expectedValue)
      .then(() => {
        return dataStore.getAllSubscriptions();
      })
      .then((subscriptions) => {
        for (const sub of subscriptions) {
          if (sub.id === expectedValue.subID) {
            expect(sub.id).to.equal(expectedValue.subID);
            done();
          }
        }
      });
  });

  it("should return one subscription.", function (done) {
    let dataStore;

    const expectedIncomingValue = {
      subID: uuid(),
      hubTopic: "follows",
      leaseStart: timestampFormatter
        .utc(new Date())
        .format("YYYY-MM-DD HH:mm:ss"),
    };

    const expectedFormattedValue = {
      id: expectedIncomingValue.subID,
      hub_topic: expectedIncomingValue.hubTopic,
      lease_start: expectedIncomingValue.leaseStart,
    };

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveSubscription(expectedIncomingValue)
      .then(() => dataStore.getSubscription(expectedIncomingValue))
      .then((subscription) => {
        expect(subscription).to.deep.equal(expectedFormattedValue);
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
    // testUtils.dockerComposeDown(done);
  });
});
