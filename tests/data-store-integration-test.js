import { expect } from "chai";
import { createDataStore } from "../subscriber/adapters/data-store";
const testUtils = require("../utils/test-utils");
import { notificationsDatabaseLocalConfig } from "../subscriber/authentications";
const timestampFormatter = require("moment");
import { uuid } from "uuidv4";
import { subscriptionRecordStub } from "../subscriber/doubles/subscriptions";

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
      hub_topic: "https://twitch.com",
      lease_start: timestampFormatter
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
        expect(subscriptions).to.include.deep.members([expectedValue]);
        done();
      });
  });

  it("should return one subscription.", function (done) {
    let dataStore;
    const expectedSubscription = subscriptionRecordStub;

    dataStore = createDataStore(notificationsDatabaseLocalConfig);
    dataStore
      .saveSubscription(expectedSubscription)
      .then(() => dataStore.getSubscription(expectedSubscription))
      .then((subscription) => {
        expect(subscription).to.deep.equal(expectedSubscription);
        done();
      });
  });

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

  after(function (done) {
    testUtils.dockerComposeDown(done);
  });
});
