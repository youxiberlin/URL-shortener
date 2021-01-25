const { Pool } = require('pg');
const { user, host, database, password, port } = require('./../config').postgres;

const connPool = {};

const connect = (endpoint) => {
	if (!connPool[endpoint]) {
		connPool[endpoint] = new Pool({ user, host, database, password, port });
		console.log(`Postgres: Connected on port ${endpoint}`);
	}
	return connPool[endpoint];
};

const db = connect(port);

module.exports = {
  query: (text, params) => db.query(text, params),
};
