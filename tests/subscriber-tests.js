const subscriber = require("../subscriber/subscriber");
import { expect } from "chai";
const dataStoreFake = require("../subscriber/doubles/data-store-fake");
const twitchStub = require("../subscriber/doubles/twitch-stub");
import {
  eventRecordStub,
  subscriptionDummy,
  subscriptionRecordStub,
} from "../subscriber/doubles/subscriptions";

describe("Subscriber Server", function () {
  it("should return a list of subscriptions.", function () {
    const subscriptions = subscriber.getAllSubscriptions(dataStoreFake);
    expect(subscriptions).to.include.deep.members([subscriptionRecordStub]);
  });

  it("should send a subscription request.", function () {
    subscriber
      .requestSubscription(twitchStub, subscriptionDummy)
      .then((response) => {
        expect(response).to.equal("Received");
      });
  });

  it("should save a subscription.", function () {
    subscriber.saveSubscription(dataStoreFake, subscriptionRecordStub);
    expect(dataStoreFake.subscriptionDatabase.size).to.equal(1);
  });

  it("should return one subscription.", function () {
    const subscription = subscriber.getSubscription(
      dataStoreFake,
      subscriptionRecordStub
    );
    expect(subscription).to.deep.equal(subscriptionRecordStub);
  });

  it("should save an event.", function () {
    const subID = "1234";
    const eventID = "5678";
    const eventData = { data: "data" };

    subscriber.saveEvent(dataStoreFake, subID, eventID, eventData);
    expect(dataStoreFake.eventDatabase.length).to.equal(1);
  });

  it("should return a list of events.", function () {
    const events = subscriber.getAllEvents(
      dataStoreFake,
      subscriptionRecordStub.id
    );
    expect(events).to.include.deep.members([eventRecordStub]);
  });

  it("should return a list of events.", function () {
    const subscriptionStub = {
      id: "fa1856cb-5695-8579-b52f-0dc908e3aad4",
      hub_topic: "https://twitch.com",
      lease_start: "2020-05-13 01:01:01",
    };

    subscriber.saveSubscription(dataStoreFake, subscriptionStub);
    expect(dataStoreFake.subscriptionDatabase.size).to.equal(1);
    subscriber.removeSubscription(dataStoreFake, subID);
  });
});
