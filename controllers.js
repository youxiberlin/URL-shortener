const db = require('./services/db');
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

const getOriginalUrl = async (req, res, next) => {
  db.query(`SELECT req_url FROM urls WHERE short_id='${req.params.id}'`)
    .then(async result => {
      const { req_url } = await result.rows[0];
      console.log('result', req_url)
      res.redirect(`http://${req_url}`)
    })
    .catch(e => console.error(e.stack))
};

module.exports = {
  postUrl,
  getOriginalUrl
};
