const path = require('path');
const compose = require('docker-compose');
import mysql from 'mysql';

const dockerComposeUp = () => {
  compose
    .upAll({ cwd: path.join(__dirname, '..'), log: true, })
    .then(() => {
      console.log('Docker-compose up ran.');
    },
      err => {
        console.log('Error running docker-compose up:', err.message);
      }
    );
};

const dockerComposeDown = (done) => {
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
};

const dockerComposeUpDatabase = () => {
  compose.upOne('database', { cwd: path.join(__dirname, '..'), log: true })
    .then(() => {
      console.log('Docker-compose up ran.');
    },
      err => {
        console.log('Error running docker-compose up:', err.message);
      }
    );
};

const checkDatabaseIsRunning = () => {
  return new Promise((resolve) => {

    console.log('* Checking database...');

    let pool = mysql.createPool({
      host: '127.0.0.1',
      port: 3307,
      user: 'user',
      password: 'password',
      database: 'notifications'
    });

    function pingDatabaseForReply() {
      pool.query('SELECT 1', function (error, results) {
        if (error) {
          setTimeout(() => {
            pingDatabaseForReply();
          }, 500);
        } else {
          console.log('* Database up.');
          resolve();
        }
      });
    }

    pingDatabaseForReply();

  });
}

const subscription = {
  id: 'ac7856cb-5695-4664-b52f-0dc908e3aa7a',
  hub_topic: 'https://twitch.com',
  lease_start: '2020-03-21 01:01:01'
};

module.exports = {
  dockerComposeUp,
  dockerComposeDown,
  dockerComposeUpDatabase,
  checkDatabaseIsRunning,
  subscription
};