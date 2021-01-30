const { app } = require('./app.js')
const { port } = require('./config');
const dbConfig = require('./config').postgres;
const redisConfig = require('./config').redis;
const pgTable = require('./config').postgresTable;
const db = require('./services/db');
const redis = require('./services/redis');

app.listen(port, async () => {
  console.log(`App running on port ${port}`);
  redis.connect(redisConfig);
  db.connect(dbConfig);
  await db.query(pgTable.createUrls)
    .then(() => console.log('Postgres executed query to create table urls'))
    .catch(err => console.error(err.stack));
  await db.query(pgTable.createIps)
    .then(() => console.log('Postgres executed query to create table ips'))
    .catch(err => console.error(err.stack));
});
