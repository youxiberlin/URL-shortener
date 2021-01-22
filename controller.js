const db = require('./db');
const { nanoid } = require('nanoid');

const postUrl = async (req, res, next) => {
  const { url } = req.body;
  const id = nanoid(8);
  const shortUrl = `tier.app/${id}`;
  
  await db.query('INSERT INTO urls (req_url, short_id) VALUES ($1, $2)', [url, id], (error, results) => {
    if (error) {
      throw error
    }
  });

  res.status(200).json({
      status: "Success!",
      result: `The shortened URL is ${shortUrl}`
  });
};

module.exports = {
  postUrl
};
