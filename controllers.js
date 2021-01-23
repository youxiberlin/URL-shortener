const db = require('./services/db');
const { nanoid } = require('nanoid');

const postUrl = async (req, res, next) => {
  const { url } = req.body;
  const id = nanoid(8);
  const shortUrl = `tier.app/${id}`;
  
  await db.query('INSERT INTO urls (req_url, short_id) VALUES ($1, $2)', [url, id])
    .then(result => console.log('result', result))
    .catch(e => {
      console.error(e.stack);
      res.status(500).json({
        status: "Error",
        result: "Server error"
      });
    });

  res.status(200).json({
      status: "Success!",
      result: `The shortened URL is ${shortUrl}`
  });
};

const getOriginalUrl = async (req, res, next) => {
  db.query('INSERT INTO ips (req_ip, short_id) VALUES ($1, $2)', [req.ip, req.params.id])
    .then(result => console.log(result))
    .catch(e => {
      console.error(e.stack);
      res.status(500).json({
        status: "Error",
        result: "Server error"
      });
    })

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
    .catch(e => console.error(e.stack));
};

const getStats = async (req, res, next) => {
  const results = await db.query('SELECT short_id, COUNT (short_id) FROM ips GROUP BY short_id')
    .catch(e => {
      console.error(e.stack)
      res.status(500).json({
        status: "Error",
        result: "Server error"
      })
    });

  const data = results.rows;
  const dataObj = data.reduce((acc, curr) => {
    acc[curr.short_id] = parseInt(curr.count, 10)
    return acc;
  }, {});

  res.status(200).json({
    status: "Success",
    data: dataObj
  });
}; 

module.exports = {
  postUrl,
  getOriginalUrl,
  getStats
};
