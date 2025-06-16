const { faker } = require('@faker-js/faker');
const { status } = require('http-status');
const request = require('supertest');

const app = require('../../app');
const { registerUser } = require('../../tests/utils');

async function createBook(token, overrides = {}) {
  const bookPayload = {
    bookName: faker.book.title(),
    author: faker.book.author(),
    isbn: faker.string.alphanumeric(11),
    ...overrides,
  };

  const res = await request(app)
    .post('/api/books')
    .set({ Authorization: `Bearer ${token}` })
    .send(bookPayload)
    .expect(status.OK);

  return res.body;
}

describe('## Book APIs', () => {
  describe('# POST /api/auth/register', () => {
    it('should create a new user for creating books', async () => {
      const { user, token } = await registerUser();

      expect(token).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.password).toBeUndefined();
    });
  });

  describe('# POST /api/books', () => {
    it('should create a new book', async () => {
      const { token, user } = await registerUser();

      const bookData = {
        bookName: faker.book.title(),
        author: faker.book.author(),
        isbn: faker.string.alphanumeric(11),
      };

      const book = await createBook(token, bookData);

      expect(book.owner).toBe(user._id);
      expect(book.bookName).toBe(bookData.bookName);
      expect(book.author).toBe(bookData.author);
      expect(book.isbn).toBe(bookData.isbn);
    });

    it('should throw error for creating a book with same name', async () => {
      const { token } = await registerUser();
      const bookName = faker.book.title();

      // Create first book with bookName
      await createBook(token, { bookName });

      // Try to create another book with same name
      const res = await request(app)
        .post('/api/books')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          bookName,
          author: faker.book.author(),
          isbn: faker.string.alphanumeric(11),
        })
        .expect(status.CONFLICT);

      expect(res.body.message).toBe('Book name must be unique');
    });
  });

  describe('# GET /api/books/:bookId', () => {
    it('should get book details', async () => {
      const { token, user } = await registerUser();
      const book = await createBook(token);

      const res = await request(app)
        .get(`/api/books/${book._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      expect(res.body.owner._id).toBe(user._id);
      expect(res.body.bookName).toBe(book.bookName);
      expect(res.body.author).toBe(book.author);
      expect(res.body.isbn).toBe(book.isbn);
    });

    it('should report error with message - Not found, when book does not exists', async () => {
      const { token } = await registerUser();

      const res = await request(app)
        .get('/api/books/56c787ccc67fc16ccc1a5e92')
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toBe('No such book exists!');
    });
  });

  describe('# PUT /api/books/:bookId', () => {
    it('should update book details', async () => {
      const { token, user } = await registerUser();
      const book = await createBook(token);

      const updatedData = {
        bookName: faker.book.title(),
        author: faker.book.author(),
        isbn: faker.string.alphanumeric(11),
      };

      const res = await request(app)
        .put(`/api/books/${book._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .send(updatedData)
        .expect(status.OK);

      expect(res.body.owner._id).toBe(user._id);
      expect(res.body.bookName).toBe(updatedData.bookName);
      expect(res.body.author).toBe(updatedData.author);
      expect(res.body.isbn).toBe(updatedData.isbn);
    });
  });

  describe('# GET /api/books/', () => {
    it('should get all books', async () => {
      const { token } = await registerUser();
      await createBook(token);

      const res = await request(app)
        .get('/api/books')
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe('# DELETE /api/books/', () => {
    it('should delete book', async () => {
      const { token, user } = await registerUser();
      const book = await createBook(token);

      const res = await request(app)
        .delete(`/api/books/${book._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      expect(res.body.owner._id).toBe(user._id);
      expect(res.body.bookName).toBe(book.bookName);
      expect(res.body.author).toBe(book.author);
      expect(res.body.isbn).toBe(book.isbn);
    });

    it('should throw error for deleting a book which was deleted already', async () => {
      const { token } = await registerUser();
      const book = await createBook(token);

      await request(app)
        .delete(`/api/books/${book._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      const res = await request(app)
        .delete(`/api/books/${book._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.NOT_FOUND);

      expect(res.body.message).toBe('No such book exists!');
    });
  });

  describe('# Error Handling', () => {
    it('should handle express validation error - isbn is required', async () => {
      const { token } = await registerUser();

      const res = await request(app)
        .post('/api/books')
        .set({ Authorization: `Bearer ${token}` })
        .send({
          bookName: faker.book.title(),
          author: faker.book.author(),
          // Not sending isbn here intentionally
        })
        .expect(status.BAD_REQUEST);

      expect(res.body.message).toBe('"isbn" is required');
    });
  });

  describe('# DELETE /api/users/', () => {
    it('should delete user after done with books testing', async () => {
      const { user, token } = await registerUser();

      const res = await request(app)
        .delete(`/api/users/${user._id}`)
        .set({ Authorization: `Bearer ${token}` })
        .expect(status.OK);

      expect(res.body.email).toBe(user.email);
      expect(res.body.firstName).toBe(user.firstName);
      expect(res.body.lastName).toBe(user.lastName);
      expect(res.body.password).toBeUndefined();
    });
  });
});
