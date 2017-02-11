import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import faker from 'faker';
import app from '../index';

chai.config.includeStack = true;

describe('## Misc', () => {
  describe('# GET /health-check', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/health-check')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.text).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/404')
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.error).to.equal('API not found');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle express validation error - email is required', (done) => {
      request(app)
        .post('/api/auth/register')
        .send({
          password: faker.internet.password()
        })
        .expect(httpStatus.BAD_REQUEST)
        .then((res) => {
          expect(res.body.error).to.equal('"email" is required');
          done();
        })
        .catch(done);
    });
  });
});
