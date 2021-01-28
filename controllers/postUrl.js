const { nanoid } = require('nanoid');
const db = require('../services/db');
const { setAsync } = require('../services/redis');

const postUrl = async (req, res) => {
  const reqKey = Object.keys(req.body)[0]
  if (reqKey && reqKey !== "url") {
    res.status(400).json({
      status: "Bad Request",
      message: "Please use url as a request key"
    })
    return;
  }

  if (!reqKey) {
    res.status(400).json({
      status: "Bad Request",
      message: "Please add url that you want to shorten. Ex.) url=www.google.com"
    })
    return;
  }

  const { url } = req.body;
  const id = nanoid(8);
  const shortUrl = `tier.app/${id}`;

  setAsync(id, url)
    .catch(err => console.error('Redis error', err));

  await db.query('INSERT INTO urls (req_url, short_id) VALUES ($1, $2)', [url, id])
    .then(result => console.log(`Inserted the URL with id ${id} to DB`))
    .catch(e => {
      console.error(e.stack);
      res.status(500).json({
        status: "Error",
        result: "Server error"
      });
    });

  res.status(200).json({
      status: "Success!",
      result: shortUrl
  });
};

module.exports = {
  postUrl,
};
