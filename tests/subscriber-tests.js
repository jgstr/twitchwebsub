import { createSubscriberManager } from "../subscriber/subscriber";
import sinon from "sinon";

describe("Subscriber Server", function () {
  // TODO: Move e2e tests 2 - 4 to here.

  // Use as mocking template.
  it("should save an event (using mocks).", function () {
    const subID = "1234";
    const eventID = "5678";
    const eventData = { data: "data" };

    const dataStoreApi = {
      saveEvent: function () {},
    };

    const mockDataStore = sinon.mock(dataStoreApi); // this mutates dataStoreApi
    mockDataStore
      .expects("saveEvent")
      .once()
      .withArgs(subID, eventID, eventData); // configuration/preparation. once() == spy
    const subManager = createSubscriberManager(dataStoreApi);
    subManager.saveEvent(subID, eventID, eventData);
    mockDataStore.verify(); // actually checks / verification
  });

  // TODO: Create unit test for subscriberManager.saveApprovedSubscription
});
