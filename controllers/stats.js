const db = require('../services/db');

const getStats = async (req, res) => {
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
    acc[curr.short_id] = parseInt(curr.count, 10);
    return acc;
  }, {});

  res.status(200).json({
    status: "Success",
    data: dataObj
  });
};

module.exports = {
  getStats
};
