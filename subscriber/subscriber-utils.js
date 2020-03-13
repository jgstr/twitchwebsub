import mysql from 'mysql';
const axios = require('axios');

const getPool = (dbConfig) => {

  let pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  });

  return pool;
};

const requestSubscription = (request, response, hubUrl, clientID, hubCallback, hubTopic) => {

  axios({
    method: 'POST',
    url: hubUrl,
    headers: {
      'Content-Type': 'application/json',
      'Client-ID': clientID
    },
    data:
    {
      'hub.callback': hubCallback,
      'hub.mode': 'subscribe',
      'hub.topic': hubTopic,
      'hub.lease_seconds': 600
    }
  })
    .then(twitchResponse => {
      console.log('* Twitch Hub Approval response: ', twitchResponse.status);
    })
    .catch(error => console.log(error));

};

module.exports = { getPool, requestSubscription };