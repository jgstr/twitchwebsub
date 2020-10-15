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

  it("should update a subscription lease.", function(){

    const subID = 123;

    const dataStoreApi = { renewSubscription: function(subscriptionID) { 
      if(!subscriptionID)
          return "You did not provide a subscriber ID.";
      return "The subscription was renewed.";
    }};
    const mockDataStore = sinon.mock(dataStoreApi);
    mockDataStore.expects("renewSubscription").once().withArgs(subID);

    const subManager = createSubscriberManager(dataStoreApi);
    subManager.renewSubscription(subID);

    mockDataStore.verify();
  });

});
