// eslint-disable-next-line unicorn/prevent-abbreviations
const { faker } = require('@faker-js/faker');
const { status } = require('http-status');
const request = require('supertest');

const app = require('../app');

async function registerUser(overrides = {}) {
  const userPayload = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    ...overrides,
  };

  const res = await request(app)
    .post('/api/auth/register')
    .send(userPayload)
    .expect(status.OK);

  return {
    user: res.body.user,
    token: res.body.token,
    password: userPayload.password,
  };
}

async function loginUser(email, password) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
    .expect(status.OK);

  return {
    user: res.body.user,
    token: res.body.token,
  };
}

module.exports = {
  registerUser,
  loginUser,
};
