import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Ticket } from '../../models/ticket';

it('it should return 404 if an id to update is not found', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
      price: 20,
    })
    .expect(404);
});
it('it should return 401 if a user updated the record is not signed in', async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'asdasd',
      price: 20,
    })
    .expect(401);
});

it('it should return 401 if a user updated the record does not owned the ticket', async () => {
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'concert',
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'asdasd',
      price: 30,
    })
    .expect(401);
});

it('it should return 400 if the user provides invalid title or price', async () => {
  const cookie = global.signin();
  // create ticket
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(201);

  // invalid title
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);
  // invalid price. negative.
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asddd',
      price: -10,
    })
    .expect(400);
  // invalid price. string.
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asddd',
      price: 'asdasd',
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();
  // create ticket
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(201);
  // valid price and title
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asddd',
      price: 30,
    })
    .expect(200);

  const response = await request(app).get(`/api/tickets/${res.body.id}`);
  expect(response.body.title).toEqual('asddd');
  expect(response.body.price).toEqual(30);
});

it('publishes the update event', async () => {
  const cookie = global.signin();
  // create ticket
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(201);
  // valid price and title
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asddd',
      price: 30,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();
  // create ticket
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(201);

  const ticket = await Ticket.findById(res.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();
  // valid price and title
  await request(app)
    .put(`/api/tickets/${res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'asddd',
      price: 30,
    })
    .expect(400);
});
