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
  it('should return an empty subscription list.', function (done) {
    console.log('*** Waiting 7 seconds to query...');
    setTimeout(() => {

      pool = mysql.createPool({
        host: 'localhost',
        user: 'admin',
        password: 'root',
        database: 'notifications'
      });
      
      pool.query('SELECT * FROM subscriptions', function (error, results) {
        if (error) {
          console.log('*** Query error: ', error);
          done();
        } else {
          console.log('*** Results!');
          done();
        }
      });
    }, 7000);

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