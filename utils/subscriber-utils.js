import mysql from 'mysql';
import { notificationsDatabaseConfig } from '../subscriber/authentications';
const dbConfig = notificationsDatabaseConfig;

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