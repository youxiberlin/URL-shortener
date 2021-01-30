const { Pool } = require('pg');
const dbConfig = require('./../config').postgres;

const connPool = {};

const connect = (config) => {
  const { user, host, database, password, port } = config;
  if (!connPool[port]) {
    connPool[port] = new Pool({ user, host, database, password, port });
    console.log(`Postgres: Connected on port ${port}`);
  }
  return connPool[port];
};

const db = connect(dbConfig);

module.exports = {
  connect: (config) => connect(config),
  query: (text, params) => db.query(text, params),
};
