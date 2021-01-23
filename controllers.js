const db = require('./services/db');
const { nanoid } = require('nanoid');

const postUrl = async (req, res, next) => {
  const { url } = req.body;
  const id = nanoid(8);
  const shortUrl = `tier.app/${id}`;
  
  await db.query('INSERT INTO urls (req_url, short_id) VALUES ($1, $2)', [url, id])
    .then(result => console.log('result', result))
    .catch(e => console.error(e.stack))


  res.status(200).json({
      status: "Success!",
      result: `The shortened URL is ${shortUrl}`
  });
};

const getOriginalUrl = async (req, res, next) => {
  db.query('INSERT INTO ips (req_ip, short_id) VALUES ($1, $2)', [req.ip, req.params.id])
    .then(result => console.log(result))
    .catch(e => console.error(e.stack))

  db.query(`SELECT req_url FROM urls WHERE short_id='${req.params.id}'`)
    .then(async result => {
      const dbResult = await result.rows[0];
      if (dbResult) {
        const { req_url } = dbResult;
        res.redirect(`http://${req_url}`)
      } else {
        res.status(400).json({
          status: "Not found",
          result: "The URL doesn't exist."
        })
      }
    })
    .catch(e => console.error(e.stack))
};

module.exports = {
  postUrl,
  getOriginalUrl
};
