require('dotenv').config();
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = process.env.PORT
const { postUrl, getOriginalUrl } = require('./controllers')
const db = require('./services/db');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.post('/shorturl', postUrl);
app.get('/:id', getOriginalUrl);
const initalizeTable_query = `CREATE TABLE IF NOT EXISTS urls (req_url TEXT NOT NULL,short_id CHAR (8) UNIQUE NOT NULL)`

app.listen(port, async () => {
  console.log(`App running on port ${port}.`)
  db.query(initalizeTable_query)
});
