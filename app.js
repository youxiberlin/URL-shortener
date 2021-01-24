const express = require('express')
const bodyParser = require('body-parser')
const { port } = require('./config');
const { postUrl, getOriginalUrl, getStats } = require('./controllers')
const db = require('./services/db');

const app = express()

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set('trust proxy', true)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.post('/shorturl', postUrl);
app.get('/:id', getOriginalUrl);
app.get('/stats/access', getStats);

const initalizeTable_urls = `CREATE TABLE IF NOT EXISTS urls (req_url TEXT NOT NULL,short_id CHAR (8) UNIQUE NOT NULL)`
const initalizeTable_ips = `CREATE TABLE IF NOT EXISTS ips (req_ip TEXT NOT NULL,short_id CHAR (8) NOT NULL)`

app.listen(port, async () => {
  console.log(`App running on port ${port}`)
  db.query(initalizeTable_urls)
  db.query(initalizeTable_ips)
});
