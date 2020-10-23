import { createSubscriberManager } from "../subscriber/subscriber";
import sinon from "sinon";
import { DateTime, Duration } from "luxon";
import { assert, expect } from "chai";

describe("Subscriber Server", function () {
  // TODO: Move e2e tests 2 - 4 to here.

  // Use as mocking template.
  it("should save an event (using mocks).", function () {
    const subID = "1234";
    const eventMessage = [{}];

    const dataStoreApi = { saveEvents: function () { } };
    const mockDataStore = sinon.mock(dataStoreApi); // this mutates dataStoreApi
    mockDataStore.expects("saveEvents").once().withArgs(subID, eventMessage); // configuration/preparation. once() == spy

    const subManager = createSubscriberManager(dataStoreApi);
    subManager.saveEvents(subID, eventMessage);

    mockDataStore.verify(); // actually checks / verification
  });

  it("should save two events.", function () {
    const subID = "1234";
    const eventMessage = [{}, {}];

    const dataStoreApi = { saveEvents: function () { } };
    const mockDataStore = sinon.mock(dataStoreApi);
    mockDataStore.expects("saveEvents").once().withArgs(subID, eventMessage);

    const subManager = createSubscriberManager(dataStoreApi);
    subManager.saveEvents(subID, eventMessage);

    mockDataStore.verify();
  });

  it("should update a subscription lease.", function(){

    const subscription = {
      id: 1234,
      hub_topic: "follows",
      lease_start: DateTime.local().minus(Duration.fromObject({seconds: 580}))
    };

    const dataStoreApi = { getAllSubscriptions: () => Promise.resolve(subscription) }
    const mockDataStore = sinon.mock(dataStoreApi);
    mockDataStore.expects("getAllSubscriptions").once().resolves(subscription);

    const twitchApi = {requestSubscription: () => {}};
    const mockTwitch = sinon.mock(twitchApi);
    mockTwitch.expects("requestSubscription").once().resolves();

    const subManager = createSubscriberManager(dataStoreApi, twitchApi);
    subManager.addToSubscriptionsAwaitingApproval("1234", subscription);
    subManager.renewExpiringSubscriptions();

    expect(subManager.getSubscriptionsAwaitingTwitchApproval()).to.include(subscription); 

    mockDataStore.verify();
  });

});
