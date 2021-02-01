const request = require('supertest');
const { app } = require('../app');
const { port } = require('../config')
const dbConfig = require('../config').postgres;
const redisConfig = require('../config').redis;
const pgTable = require('../config').postgresTable;
const pg = require('../services/db');
const redis = require('../services/redis');

let redisClient;
let server;
let db;

beforeAll(async () => {
  server = await app.listen(port, () => console.log(`App running on port ${port}`));
  redisClient = await redis.connect(redisConfig);
  db = await pg.connect(dbConfig);
  await db.query(pgTable.dropUrls)
    .then(() => console.log('Postgres executed query to drop table urls'))
    .catch(err => console.error(err.stack));
  await db.query(pgTable.dropIps)
    .then(() => console.log('Postgres executed query to drop table ips'))
    .catch(err => console.error(err.stack));
  await db.query(pgTable.createUrls)
    .then(() => console.log('Postgres executed query to create table urls'))
    .catch(err => console.error(err.stack));
  await db.query(pgTable.createIps)
    .then(() => console.log('Postgres executed query to create table ips'))
    .catch(err => console.error(err.stack));
})

afterAll(async (done) => {
  server.close(() => {
    console.log('App closed.');
    redisClient.quit(() => {
       console.log('redis client quit')
       done();
    });
  })
});

describe('GET /', function() {
  it('responds with json', function(done) {
    request(app)
      .get('/')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        info: "Node.js, Express, and Postgres API"
      })
      .end(done)
  });
});

describe('POST /shorturl - get a new short url', () => {
  it('should get a a new short url', (done) => {
    return request(app)
      .post('/shorturl')
      .send({ url: 'www.google.com'})
      .expect(200)
      .expect(res => {
        expect(res.body.status).toBe("Success!")
        expect(res.body.result).toMatch(/^tier.app\/[a-zA-Z0-9_-]{8}$/)
      })
      .end(done)
  })

  it('should return 400 when the request key is not url', (done) => {
    return request(app)
      .post('/shorturl')
      .send({ ul: "google.com"})
      .expect(400)
      .expect(res => {
        expect(res.body.status).toBe("Bad Request")
        expect(res.body.message).toBe("Please use url as a request key")
      })
      .end(done)
  })

  it('should return 400 when the request body is empty', (done) => {
    return request(app)
      .post('/shorturl')
      .send({})
      .expect(400)
      .expect(res => {
        expect(res.body.status).toBe("Bad Request")
        expect(res.body.message).toBe("Please add url that you want to shorten. Ex.) url=www.google.com")
      })
      .end(done)
  })
});

describe('GET /id', () => {
  beforeEach(async () => {
    await db.query('INSERT INTO urls (req_url, short_id) VALUES ($1, $2)', ['www.tier.app', 'GtiRylUB'])
      .then(() => console.log(`Inserted the URL with id GtiRylUB to DB`))
      .catch(e => console.error(e.stack));
  });

  afterEach(async () => {
    await db.query(`DELETE FROM urls WHERE short_id='GtiRylUB'`)
      .then(() => console.log(`Deleted the id GtiRylUB`))
      .catch(e => console.error(e.stack));
  })

  it('should return 302 when the request was sent to the id', (done) => {
    return request(app)
      .get('/GtiRylUB')
      .expect(302)
      .end(done)
  })

  it('should return 404 when the id does not exist', (done) => {
    return request(app)
      .get('/GtiRylU')
      .expect(404)
      .end(done)
      .expect(res => {
        expect(res.body.status).toBe("Not found")
        expect(res.body.result).toBe("The URL doesn't exist.")
      })
  })
})