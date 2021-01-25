const db = require('../services/db');
const { getAsync, setAsync } = require('../services/redis');

const getOriginalUrl = async (req, res) => {
  const { id } = req.params;

  const redisRes = await getAsync(id)
    .catch(err => {
      console.error('Redis error', err);
      res.status(500).json({
        status: "Error",
        result: "Server error"
      });
    });

  if (redisRes) {
    res.redirect(`http://${redisRes}`);
    db.query('INSERT INTO ips (req_ip, short_id) VALUES ($1, $2)', [req.ip, id])
      .then(() => console.log(`Inserted ip ${req.ip} to ${id} in DB`))
      .catch(e => {
        console.error(e.stack);
      });
  } else {
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
      res.redirect(`http://${req_url}`);

      setAsync(id, req_url)
        .catch(err => console.error('Redis error', err));

      db.query('INSERT INTO ips (req_ip, short_id) VALUES ($1, $2)', [req.ip, id])
        .then(result => console.log(`Inserted ip ${req.ip} to ${id} in DB`))
        .catch(e => {
          console.error(e.stack);
        });
    } else {
      res.status(400).json({
          status: "Not found",
          result: "The URL doesn't exist."
        })
    }
  }
};

module.exports = {
  getOriginalUrl,
};
