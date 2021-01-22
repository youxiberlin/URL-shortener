const db = require('./db');
const { nanoid } = require('nanoid');

const postUrl = async (req, res, next) => {
  const { url } = req.body
  const shortUrl = `tier.app/${nanoid(8)}`
  
  await db.query('INSERT INTO urls (req_url, short_url) VALUES ($1, $2)', [url, shortUrl], (error, results) => {
    if (error) {
      throw error
    }
  })

  res.status(200).json({
      status: "Success!",
      message: "Data is successfully imported."
  })
};

module.exports = {
  postUrl
};
