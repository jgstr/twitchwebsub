import sinon from "sinon";
import {createSubscriberManager} from "../subscriber/subscriber";

describe("Subscription Renewer", function(){


  it("should renew expiring subscriptions.", function(){
    
    const dataStoreAPI = {}; 
    const twtichAPI = {};
    const subscriberManager = createSubscriberManager(dataStoreAPI, twtichAPI);
    
    // Not sure what to do next. I can't figure out how I'm to confirm that subscriptions are renewed.
    // Do I get a list of subscriptions, find the ones that are expiring in 1 minute, renew those, 
    // save the renewed subscription id, get that subscription again from the database, 
    // then compare the lease_start times?

  });

  // https://stackoverflow.com/questions/46754569/how-to-test-a-function-that-uses-settimeout-internally-with-mocha/46754919
  it('Sample test: console logs hello ONLY after 100ms',function(){
    const clock = sinon.useFakeTimers();
    const logSpy = sinon.spy(console, 'log');
    helloAfter100ms();
    expect(logSpy).to.not.have.been.called;
    clock.tick(100);
    expect(logSpy).to.have.been.calledOnce;
    logSpy.restore();
    clock.restore();
  }

});