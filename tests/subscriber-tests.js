const subscriber = require('../utils/subscriber-driver');

describe('Subscriber Server', function () {

  before(function(done){
    subscriber.start(subscriberApp)
    .then(done);
  });

  // Note: 2nd end-to-end tests should have gone here, but I accidentally skipped that step.

  it('should remove one subscription.', function () {
    subscriber.removeSubscription(subscription);
  });
});