import { faker } from '@faker-js/faker';
import { status } from 'http-status';
import request from 'supertest';

import app from '../app.mjs';

describe('## Misc', () => {
  describe('# GET /api/health-check', () => {
    it('should return OK', async () => {
      const res = await request(app)
        .get('/api/health-check')
        .expect(status.OK);
      expect(res.text).toBe('OK');
    });
  });

  describe('# GET /api404', () => {
    it('should return 404 status', async () => {
      const res = await request(app)
        .get('/api404')
        .expect(status.NOT_FOUND);
      expect(res.body.message).toBe('API Not Found');
    });
  });

  describe('# Error Handling', () => {
    it('should handle express validation error - username is required', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: faker.internet.email(),
        })
        .expect(status.BAD_REQUEST);
      expect(res.body.message).toBe('"password" is required');
    });
  });
});
