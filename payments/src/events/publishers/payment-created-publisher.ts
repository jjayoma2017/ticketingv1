import { Subjects, Publisher, PaymentCreatedEvent } from '@jtjticketing/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
