import { faker } from '@faker-js/faker';
import { status } from 'http-status';
import request from 'supertest';

import app from '../../app.mjs';
import { loginUser, registerUser } from '../../tests/utils.mjs';

describe('## User APIs', () => {
  describe('# POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const { user, token } = await registerUser();

      expect(token).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.password).toBeUndefined();
    });

    it('should not create a new user as duplicate email', async () => {
      const { user: existingUser, password } = await registerUser();

      const duplicateUserPayload = {
        email: existingUser.email,
        password,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(duplicateUserPayload)
        .expect(status.CONFLICT);

      expect(res.body.message).toBe('Email must be unique');
    });
  });

  describe('# POST /api/auth/login', () => {
    it('should login the registered user', async () => {
      const { user, password } = await registerUser();

      const { user: loggedInUser, token } = await loginUser(user.email, password);

      expect(token).toBeDefined();
      expect(loggedInUser.email).toBe(user.email);
      expect(loggedInUser.password).toBeUndefined();
    });

    it('should error when wrong password is provided', async () => {
      const { user } = await registerUser();

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: user.email, password: faker.string.alphanumeric(8) })
        .expect(status.UNAUTHORIZED);

      expect(res.body.message).toBe('User email and password combination do not match');
    });
  });

  describe('# GET /api/users/:userId', () => {
    it('should get user details', async () => {
      const { user, token } = await registerUser();

      const res = await request(app)
        .get(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      expect(res.body.email).toBe(user.email);
      expect(res.body.password).toBeUndefined();
    });

    it('should report error with message - Not found, when user does not exists', async () => {
      const { token } = await registerUser();

      const res = await request(app)
        .get('/api/users/56c787ccc67fc16ccc1a5e92')
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toBe('No such user exists!');
    });
  });

  describe('# PUT /api/users/:userId', () => {
    it('should update user details', async () => {
      const { user, token } = await registerUser();

      const updatedFirstName = faker.person.firstName();
      const payload = { firstName: updatedFirstName, lastName: user.lastName };

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(payload)
        .expect(status.OK);

      expect(res.body.firstName).toBe(updatedFirstName);
      expect(res.body.password).toBeUndefined();
    });

    it('should error if user tries to change email', async () => {
      const { user, token } = await registerUser();

      const payload = {
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
      };

      const res = await request(app)
        .put(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(payload)
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toBe('"email" is not allowed');
    });
  });

  describe('# GET /api/users/', () => {
    it('should get all users', async () => {
      const { token } = await registerUser();

      const res = await request(app)
        .get('/api/users')
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].password).toBeUndefined();
      expect(res.body[0].email).toBeDefined();
    });
  });

  describe('# GET /api/users/profile', () => {
    it('should get user profile', async () => {
      const { token, user } = await registerUser();

      const res = await request(app)
        .get('/api/users/profile')
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      expect(res.body.email).toBe(user.email);
      expect(res.body.password).toBeUndefined();
    });
  });

  describe('# DELETE /api/users/', () => {
    it('should delete user', async () => {
      const { token, user } = await registerUser();

      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      expect(res.body.email).toBe(user.email);
      expect(res.body.password).toBeUndefined();
    });

    it('should throw 404 error if the user was already deleted', async () => {
      const { token, user } = await registerUser();

      // Delete user first
      await request(app)
        .delete(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      // Try deleting again
      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toBe('No such user exists!');
    });

    it('should throw 404 error when requesting profile after user deletion', async () => {
      const { token, user } = await registerUser();

      // Delete user first
      await request(app)
        .delete(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      // Request profile
      const res = await request(app)
        .get('/api/users/profile')
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toBe('No such user exists!');
    });
  });
});
