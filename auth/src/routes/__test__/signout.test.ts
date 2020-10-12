import request from 'supertest';
import { app } from '../../app';

it('after signout, cookie must expire', async () => {
  const res = await request(app).post('/api/users/signout').send({});

  expect(res.get('Set-Cookie')[0]).toEqual(global.expireCookie);
});
