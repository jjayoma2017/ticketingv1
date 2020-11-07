import { Ticket } from '../models/ticket';
import express, { Request, Response } from 'express';
import { NotFoundError } from '@jtjticketing/common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const response = await Ticket.findById(req.params.id);
  if (!response) {
    throw new NotFoundError();
  }

  res.send(response);
});

export { router as ticketShowRouter };
