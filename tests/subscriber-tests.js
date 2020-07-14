import { createSubscriberManager } from "../subscriber/subscriber";
import { expect } from "chai";
const dataStoreFake = require("../subscriber/doubles/data-store-fake");
const twitchStub = require("../subscriber/doubles/twitch-stub");
import {
  eventRecordStub,
  eventRecordListStub,
  subscriptionDummy,
  subscriptionRecordStub,
} from "../subscriber/doubles/subscriptions";

// Might need to move this to it's own module eventually.
const twitchDummy = { requestSubscription: () => Promise.resolve("Received") };
const subscriberManager = createSubscriberManager(dataStoreFake, twitchDummy);

console.log("Subscriber Manager: ", subscriberManager);

describe("Subscriber Server", function () {
  it("should return a list of subscriptions.", function () {
    const subscriptions = subscriberManager.getAllSubscriptions();
    expect(subscriptions).to.include.deep.members([subscriptionRecordStub]);
  });

  it("should send a subscription request.", function () {
    subscriberManager
      .requestSubscription(subscriptionDummy)
      .then((response) => {
        expect(response).to.equal("Received");
      });
  });

  it("should save a subscription.", function () {
    subscriberManager.saveSubscription(subscriptionRecordStub);
    expect(dataStoreFake.subscriptionDatabase.size).to.equal(1);
  });

  it("should return one subscription.", function () {
    const subscription = subscriberManager.getSubscription(
      subscriptionRecordStub
    );
    expect(subscription).to.deep.equal(subscriptionRecordStub);
  });

  it("should save an event.", function () {
    const subID = "1234";
    const eventID = "5678";
    const eventData = { data: "data" };

    subscriberManager.saveEvent(subID, eventID, eventData);
    expect(dataStoreFake.eventDatabase.length).to.equal(1);
  });

  it("should return a list of events.", function () {
    const events = subscriberManager.getAllEvents(subscriptionRecordStub.id);
    expect(events).to.include.deep.members([eventRecordStub]);
  });

  it("should removed a subscription.", function () {
    expect(subscriberManager.removeSubscription("12345")).to.equal("Removed.");
  });

  it("should return a list of latest events.", function () {
    const events = subscriberManager.getLatestEvents(subscriptionRecordStub.id);
    expect(events).to.include.deep.members(eventRecordListStub);
  });
});
