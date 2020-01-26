'use strict';
const path = require('path');
const compose = require('docker-compose');

describe('Twitch Websub Subscriber', function (done) {
  this.timeout(17000);

  before(function (done) {
    compose
      .upAll({ cwd: path.join(__dirname, '..'), log: true, })
      .then(
        () => {
          console.log('Docker-compose up ran.');
          done();
        },
        err => {
          console.log('Error running docker-compose up:', err.message);
          done();
        }
      );
  });

  // Get a subscription list.
  it('should return an empty subscription list.', function (done) {
    console.log('*** Test timeout start.');
    setTimeout(done(), 1000);
  });

  // Send the subscription request to Twitch.
  // it('should receive a 2xx response from Twitch.',function(){

  // });

  // Write the subscription to the database and Read it.
  // it('should return one subscription record.', function () {

  // });

  after(function (done) {
    compose
      .down(["--rmi all"])
      .then(
        () => {
          console.log('Docker-compose down ran.');
          done();
        },
        err => {
          console.log('Something went wrong when trying to stop containers:', err.message);
          done();
        });
  });
});