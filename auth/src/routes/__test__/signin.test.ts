import request from 'supertest';
import { app } from '../../app';

it('after signout, cookie must expire', async () => {
  const cookie = await global.signin();

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send();

  expect(cookie).not.toEqual(global.expireCookie);

  const res2 = await request(app).post('/api/users/signout').send({});
  expect(res2.get('Set-Cookie')[0]).toEqual(global.expireCookie);
});
