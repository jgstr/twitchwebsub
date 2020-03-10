import mysql from 'mysql';
import { notificationsDatabaseLocalConfig } from '../subscriber/authentications';
const dbConfig = notificationsDatabaseLocalConfig;

const getPool = () => {

  let pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  });

  return pool;
};

module.exports = { getPool };