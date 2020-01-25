'use strict';
const path = require('path');
const compose = require('docker-compose');

describe('Twitch Websub Subscriber', function (done) {
  this.timeout(10000);

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

  it('should return one event record from the database.', function (done) {
    // expect record from database to return 1 row
    console.log('*** Test timeout start.');
    setTimeout(done(), 5000);
  });

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