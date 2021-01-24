const db = require('./services/db');
const { nanoid } = require('nanoid');
const redis = require("redis");
const client = redis.createClient();
const { promisify } = require("util");
const getAsync = promisify(client.get).bind(client);

const postUrl = async (req, res, next) => {
  const { url } = req.body;
  const id = nanoid(8);
  const shortUrl = `tier.app/${id}`;
  client.set(id, url, (err, res) => {
    if (err) console.error('Redis error', err)
  });
  
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


const getOriginalUrl = async (req, res, next) => {
  const { id } = req.params;

  const redisRes = await getAsync(id)
    .catch(err => {
      console.error('Redis error', err);
      res.status(500).json({
        status: "Error",
        result: "Server error"
      });
    })

  if (redisRes) res.redirect(`http://${redisRes}`)
  else {
    const dbRes = await db.query(`SELECT req_url FROM urls WHERE short_id='${id}'`)
      .catch(e => {
        console.error("DB Error", e.stack);
        res.status(500).json({
          status: "Error",
          result: "Server error"
        });
      });

    const result = dbRes.rows[0];
    if (result) {
      const { req_url } = result;
      res.redirect(`http://${req_url}`)
    } else {
      res.status(400).json({
          status: "Not found",
          result: "The URL doesn't exist."
        })
    }
  }
  
  db.query('INSERT INTO ips (req_ip, short_id) VALUES ($1, $2)', [req.ip, id])
    .then(result => console.log(`Inserted ip ${req.ip} to ${id} in DB`))
    .catch(e => {
      console.error(e.stack);
    })
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
