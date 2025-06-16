/* eslint-disable sonarjs/no-hardcoded-passwords */
const { faker } = require('@faker-js/faker');
const { status } = require('http-status');
const request = require('supertest');

const app = require('../../app');

describe('## Auth APIs', () => {
  let user;

  beforeEach(() => {
    user = {
      email: faker.internet.email(),
      password: 'Password123!', // Use a fixed strong password for consistency
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
    };
  });

  describe('# POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(status.OK);

      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.user.firstName).toBe(user.firstName);
      expect(res.body.user.lastName).toBe(user.lastName);
      expect(res.body.user.password).toBeUndefined();
    });

    it('should not allow duplicate email registration', async () => {
      // First register the user
      await request(app).post('/api/auth/register').send(user).expect(status.OK);

      // Then try to register again with the same email
      const res = await request(app)
        .post('/api/auth/register')
        .send(user)
        .expect(status.CONFLICT);

      expect(res.body.message).toBe('Email must be unique');
    });
  });

  describe('# POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register user before login tests
      await request(app).post('/api/auth/register').send(user).expect(status.OK);
    });

    it('should login with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(status.OK);

      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(user.email);
      expect(res.body.user.password).toBeUndefined();
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: 'wrongpassword' })
        .expect(status.UNAUTHORIZED);

      expect(res.body.message).toBe('User email and password combination do not match');
    });

    it('should reject login with non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'notfound@example.com', password: 'any-password' })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toBe('No such user exists!');
    });
  });
});
