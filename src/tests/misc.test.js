const request = require('supertest');
const httpStatus = require('http-status');
const faker = require('faker');
const chai = require('chai');
const server = require('../../index');

/* eslint prefer-destructuring: 0 */
const expect = chai.expect;
chai.config.includeStack = true;

/**
 * root level hooks
 */
describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', (done) => {
      request(server)
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
      request(server)
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
      request(server)
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
