import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { connections } from 'mongoose';
import { app } from '../app';
import request from 'supertest';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): Promise<string[]>;
      expireCookie: string;
    }
  }
}
let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdf';
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email,
      password,
    })
    .expect(201);
  const cookie = res.get('Set-Cookie');
  return cookie;
};

global.expireCookie =
  'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly';
