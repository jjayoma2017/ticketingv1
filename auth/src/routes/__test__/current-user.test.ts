import request from 'supertest';
import { app } from '../../app';

it('after signin, currentuser must have a value', async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.currentUser.email).toEqual('test@test.com');
});

it('without cookie, currentuser route must give Not Authorized error', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(401);
  expect(res.body.errors[0].message).toEqual('Not Authorized error');
  expect(res.body.currentUser).toEqual(undefined);
});
