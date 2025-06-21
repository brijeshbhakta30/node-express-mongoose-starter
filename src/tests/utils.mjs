import { faker } from '@faker-js/faker';
import { status } from 'http-status';
import request from 'supertest';

import app from '../app.mjs';

export async function registerUser(overrides = {}) {
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

export async function loginUser(email, password) {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
    .expect(status.OK);

  return {
    user: res.body.user,
    token: res.body.token,
  };
}
