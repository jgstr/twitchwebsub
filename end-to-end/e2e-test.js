'use strict';
const path = require('path');
const compose = require('docker-compose');
import { expect } from 'chai';
import mysql from 'mysql';

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
  it('should return an empty subscription list.', function () {

    let pool = mysql.createPool({
      host: 'localhost',
      port: 3000,
      user: 'root',
      password: 'root',
      database: 'notifications'
    });
    
    let subscriptions = pool.query('SELECT * FROM subscriptions', function(error){
      console.log("*** MySQL Error: ", error);
    })

    expect(subscriptions.length).to.equal(0);
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