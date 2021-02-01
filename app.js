const express = require('express');
const bodyParser = require('body-parser');
const { postUrl, getOriginalUrl, getStats } = require('./controllers');

const app = express();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.set('trust proxy', true);

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
});

app.post('/shorturl', postUrl);
app.get('/:id', getOriginalUrl);
app.get('/stats/access', getStats);

module.exports = { app }
