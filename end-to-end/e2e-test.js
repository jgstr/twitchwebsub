'use strict';
const path = require('path');
const compose = require('docker-compose');
import { expect } from 'chai';
import mysql from 'mysql';

describe('Twitch Websub Subscriber', function (done) {
  this.timeout(30000);

  let pool;

  before(function (done) {
    compose
      .upAll({ cwd: path.join(__dirname, '..'), log: true, })
      .then(() => {
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
  it('should return one subscription.', function (done) {

    let subscriptions;

    // Receive no subscriptions.
    setTimeout(() => {

      pool = mysql.createPool({
        host: 'localhost',
        user: 'user',
        password: 'password',
        database: 'notifications'
      });

      pool.query('SELECT * FROM subscriptions', function (error, results) {
        if (error) {
          console.log('Error: ', error);
          done();
        } else {
          console.log('*** Results!');
          done();
        }
      });
    }, 7000);

    // Subscribe to a Twitch event.

    // Receive one subscription. (Use an assertion like this when ready.)
    // expect(subscriptions.length).to.equal(1);

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