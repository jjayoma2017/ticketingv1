import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledEvent, OrderStatus } from '@jtjticketing/common';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Message } from 'node-nats-streaming';

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = mongoose.Types.ObjectId().toHexString();
  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });
  ticket.set({ orderId });

  await ticket.save();

  // Create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg, orderId };
};

it('updates the ticket, publishers an event, and acks the message', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);
  expect(updatedTicket!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
