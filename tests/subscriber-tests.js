import { createSubscriberManager } from "../subscriber/subscriber";
import sinon from "sinon";
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

  it("should return an error message if given no subscriptoin ID.", function () {

    const dataStoreApi = {};
    const subManager = createSubscriberManager(dataStoreApi);
    const result = subManager.renewSubscription();
    expect(result).to.equal("You did not provide a subscriber ID.");
  });

  it("should update a subscriptions end-lease timestamp.", function(){
    const dataStoreApi = {};
    const subManager = createSubscriberManager(dataStoreApi);
    const subscriptionID = 123;
    const result = subManager.renewSubscription(subscriptionID);
    expect(result).to.equal("Your subscription was renewed.");
  });
});
