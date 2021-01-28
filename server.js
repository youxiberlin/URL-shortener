const { app } = require('./app.js')
const { port } = require('./config');
const db = require('./services/db');

const initalizeTable_urls = `CREATE TABLE IF NOT EXISTS urls (req_url TEXT NOT NULL,short_id CHAR (8) UNIQUE NOT NULL)`
const initalizeTable_ips = `CREATE TABLE IF NOT EXISTS ips (req_ip TEXT NOT NULL,short_id CHAR (8) NOT NULL)`

app.listen(port, async () => {
  console.log(`App running on port ${port}`);
  db.query(initalizeTable_urls);
  db.query(initalizeTable_ips);
});
