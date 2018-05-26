const request = require('supertest-as-promised');
const httpStatus = require('http-status');
const faker = require('faker');
const chai = require('chai');
const app = require('../index');

const expect = chai.expect;
chai.config.includeStack = true;

describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/api/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('API Not Found');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle express validation error - username is required', (done) => {
      request(app)
        .post('/api/auth/login')
        .send({
          email: faker.internet.email(),
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.message).to.equal('"password" is required');
          done();
        })
        .catch(done);
    });
  });
});
