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

    // So what's the highest TPP test? 
    // How to we confirm a subscription was renewed???

    // To start, think about the requirements for renewing a subscriptions:
    // 1. The currentTime must be BEFORE than the subscription leaseEndTime.
    // 2. This application must send a Request to Twitch to renew the lease.

    // So how do we measure and store the leaseEndTime? 
    // And how do we call the Twitch API?
    // All great questions, but that's not TDD. Just start with the highest priority test.
    const dataStoreApi = {};
    const subManager = createSubscriberManager(dataStoreApi);
    const result = subManager.renewSubscription();
    expect(result).to.equal("You did not provide a subscriber ID.");
  });

  // TODO: 10/11/2020 Next, figure out how to follow TPP and still let it use the neighbor objects it requires (data-store).  
  it("should update a subscriptions end-lease timestamp.", function(){
    const dataStoreApi = {};
    const subManager = createSubscriberManager(dataStoreApi);
    const subscriptionID = 123;
    const result = subManager.renewSubscription(subscriptionID);
    expect(result).to.equal("Your subscription was renewed.");
  });
});
