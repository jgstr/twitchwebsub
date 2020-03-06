const path = require('path');
const compose = require('docker-compose');
import mysql from 'mysql';

const dockerComposeUp = (done) => {
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

const dockerComposeUpDatabase = (done) => {
  compose.upOne('database', { cwd: path.join(__dirname, '..'), log: true })
    .then(() => done() )
    .catch(error => console.log(error));
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

module.exports = { dockerComposeUp, dockerComposeDown, dockerComposeUpDatabase, checkDatabaseIsRunning };