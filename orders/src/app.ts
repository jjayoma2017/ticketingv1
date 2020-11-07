import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { indexOrderRouter } from '../src/routes/index';
import { newOrderRouter } from '../src/routes/new';
import { showOrderRouter } from '../src/routes/show';
import { deleteOrderRouter } from '../src/routes/delete';

import { errorHandler, NotFoundError, currentUser } from '@jtjticketing/common';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
