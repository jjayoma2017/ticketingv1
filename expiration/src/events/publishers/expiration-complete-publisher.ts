import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@jtjticketing/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
