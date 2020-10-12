import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on sucessful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  expect(res.body.email).toEqual('test@test.com');
});

it('returns a 400 with an invalid email', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest',
      password: 'password',
    })
    .expect(400);
  expect(res.body.errors[0].message).toEqual('Email must be valid');
  expect(res.body.errors[0].field).toEqual('email');
});

it('returns a 400 with an invalid password', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '1',
    })
    .expect(400);
  expect(res.body.errors[0].message).toEqual(
    'Password must be between 4 and 20 characters'
  );
  expect(res.body.errors[0].field).toEqual('password');
});

it('returns a 400 with an invalid email and password', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'testtest.com',
      password: '1',
    })
    .expect(400);
  //console.log(res.body.errors);
  expect(res.body.errors[0].message).toEqual('Email must be valid');
  expect(res.body.errors[0].field).toEqual('email');
  expect(res.body.errors[1].message).toEqual(
    'Password must be between 4 and 20 characters'
  );
  expect(res.body.errors[1].field).toEqual('password');
});

it('disallows duplicate emails', async () => {
  let res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  expect(res.body.email).toEqual('test@test.com');

  res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
  expect(res.body.errors[0].message).toEqual('Email in use.');
});

it('Sets a cookie after sucessful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
