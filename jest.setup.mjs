import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterEach(async () => {
  // Clean all collections after each test to have isolated tests
  const { collections } = mongoose.connection;
  const promises = Object.values(collections).map(collection => collection.deleteMany({}));
  await Promise.all(promises);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});
