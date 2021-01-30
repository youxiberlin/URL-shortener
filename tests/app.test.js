const request = require('supertest');
const { app } = require('../app');
const dbConfig = require('../config').postgres;
const redisConfig = require('../config').redis;
const db = require('../services/db');
const redis = require('../services/redis');

let redisClient;
beforeAll(() => {
  redisClient = redis.connect(redisConfig);
  db.connect(dbConfig);
})

afterAll((done) => {
  redisClient.quit(() => {
     console.log('redis client quit')
     done();
  });
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
        expect(res.body.message).toMatch("Please use url as a request key")
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
        expect(res.body.message).toMatch("Please add url that you want to shorten. Ex.) url=www.google.com")
      })
      .end(done)
  })
});
