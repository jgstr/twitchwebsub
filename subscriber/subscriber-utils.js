import mysql from 'mysql';

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

module.exports = { getPool };