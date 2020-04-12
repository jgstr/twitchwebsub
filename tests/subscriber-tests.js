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
    expect(dataStoreFake.database.length).to.equal(1);
  });

  it("should return one subscription.", function () {
    const subscription = subscriber.getSubscription(
      dataStoreFake,
      subscriptionRecordStub
    );
    expect(subscription).to.deep.equal(subscriptionRecordStub);
  });

  it("should return a list of events.", function () {
    const events = subscriber.getAllEvents(
      dataStoreFake,
      subscriptionRecordStub.id
    );
    expect(events).to.include.deep.members([eventRecordStub]);
  });
});
