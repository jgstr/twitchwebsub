import { createSubscriberManager } from "../subscriber/subscriber";
import sinon from "sinon";

describe("Subscriber Server", function () {
  // TODO: Move e2e tests 2 - 4 to here.

  // Use as mocking template.
  it("should save an event (using mocks).", function () {
    const subID = "1234";
    const eventMessage = [{}];

    const dataStoreApi = { saveEvent: function () { } };
    const mockDataStore = sinon.mock(dataStoreApi); // this mutates dataStoreApi
    mockDataStore.expects("saveEvent").once().withArgs(subID, eventMessage); // configuration/preparation. once() == spy

    const subManager = createSubscriberManager(dataStoreApi);
    subManager.saveEvent(subID, eventMessage);

    mockDataStore.verify(); // actually checks / verification
  });

  // Old test.
  // it("should save two events.", function () {
  //   const subID = "1234";
  //   const eventMessage = [{}, {}];

  //   const dataStoreApi = { saveEvent: function () { } };
  //   const mockDataStore = sinon.mock(dataStoreApi);
  //   mockDataStore.expects("saveEvent").twice().withArgs(subID, eventMessage);

  //   const subManager = createSubscriberManager(dataStoreApi);
  //   subManager.saveEvent(subID, eventMessage);

  //   mockDataStore.verify();
  // });

  // Does this test really help? The only difference is eventMessage has two objects.
  it("should save two events.", function () {
    const subID = "1234";
    const eventMessage = [{}, {}];

    const dataStoreApi = { saveEvent: function () { } };
    const mockDataStore = sinon.mock(dataStoreApi);
    mockDataStore.expects("saveEvent").once().withArgs(subID, eventMessage);

    const subManager = createSubscriberManager(dataStoreApi);
    subManager.saveEvent(subID, eventMessage);

    mockDataStore.verify();
  });
});
