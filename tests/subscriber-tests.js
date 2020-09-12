import { createSubscriberManager } from "../subscriber/subscriber";
import sinon from "sinon";

describe("Subscriber Server", function () {
  // TODO: Move e2e tests 2 - 4 to here.

  // Use as mocking template.
  it("should save an event (using mocks).", function () {
    const subID = "1234";
    const eventData = [{}];

    const dataStoreApi = { saveEvent: function () { } };
    const mockDataStore = sinon.mock(dataStoreApi); // this mutates dataStoreApi
    mockDataStore.expects("saveEvent").once().withArgs(subID, eventData); // configuration/preparation. once() == spy
    const subManager = createSubscriberManager(dataStoreApi);
    subManager.saveEvent(subID, eventData);
    mockDataStore.verify(); // actually checks / verification
  });

  it("should save two events.", function () {
    const subID = "1234";
    const eventData = [{}, {}];

    const dataStoreApi = { saveEvent: function () { } };
    const mockDataStore = sinon.mock(dataStoreApi);
    mockDataStore.expects("saveEvent").twice().withArgs(subID, eventData);

    const subManager = createSubscriberManager(dataStoreApi);
    subManager.saveEvent(subID, eventData);

    mockDataStore.verify();
  });
});
